import * as status from "../utils/status_code.utils.js";
import logger from "../../config/logger.config.js";
import { QUICKBOOKS_REPORTS_LOGS } from "../utils/constants/log.constants.js";
import { HARDCODED_STRINGS } from "../utils/constants/strings.constants.js";
import axios from "axios";
import { decrypt } from "../utils/encryption.utils.js";
import {
  formatDateOnly,
  createValidatedDateRange,
} from "../utils/date.utils.js";
import reportsRepository from "../repositories/reports.repository.js";
import { getTokensDirectly } from "./quickbooks.service.js";
import {
  processPnLData,
  getPnLReportsByRealmId as getPnLReports,
} from "../utils/pnl.utils.js";
import { insertLines as insertTrialBalanceLines } from "../utils/trial-balance.utils.js";
import {
  processBalanceSheetData,
  getBalanceSheetReportsByRealmId as getBalanceSheetReports,
} from "../utils/balance-sheet.utils.js";
import {
  processCashFlowData,
  getCashFlowReportsByRealmId as getCashFlowReports,
} from "../utils/cash-flow.utils.js";
import { getQuickbooksApiUrl } from "../../config/quickbooks.config.js";

const BATCH_SIZE = 1000;

// API Configuration
const API_CONFIG = {
  headers: { Accept: "application/json" },
  timeout: 30000,
  retries: 1,
};

// Helper functions for cleaner code

const createEndpoint = (realmId, reportName, startDate, endDate) =>
  `/v3/company/${realmId}/reports/${reportName}?start_date=${startDate}&end_date=${endDate}&summarize_column_by=Month&minorversion=75`;

const createAuthHeaders = (token) => ({
  ...API_CONFIG.headers,
  Authorization: `Bearer ${token}`,
});

/**
 * Execute API request with retry logic
 */
const executeApiRequest = async (url, headers, reportName) => {
  try {
    logger.debug("Executing API request", {
      url,
      reportName,
      timeout: API_CONFIG.timeout,
    });
    const response = await axios.get(url, {
      headers,
      timeout: API_CONFIG.timeout,
    });
    logger.info(QUICKBOOKS_REPORTS_LOGS.FETCH_SUCCESS, {
      reportName,
      dataSize: JSON.stringify(response.data).length,
    });
    return response.data;
  } catch (error) {
    logger.error(QUICKBOOKS_REPORTS_LOGS.API_REQUEST_FAILED, {
      reportName,
      error: error.message,
      status: error.response?.status,
    });
    throw error;
  }
};

/**
 * Handle token refresh and retry
 */
const handleTokenRetry = async (
  quickbookAccount,
  reportName,
  startDate,
  endDate
) => {
  logger.warn(QUICKBOOKS_REPORTS_LOGS.RETRY_FOR_TOKEN);

  const updatedUser = await getTokensDirectly(quickbookAccount);
  if (!updatedUser) {
    throw new Error(HARDCODED_STRINGS.REPORT_DEFAULTS.FAILED_TO_REFRESH_TOKEN);
  }

  const newAccessToken = await decrypt(updatedUser.access_token);
  const endpoint = createEndpoint(
    quickbookAccount.realm_id,
    reportName,
    startDate,
    endDate
  );
  const url = getQuickbooksApiUrl(
    `company/${quickbookAccount.realm_id}/reports/${reportName}?start_date=${startDate}&end_date=${endDate}&summarize_column_by=Month&minorversion=75`
  );

  const response = await executeApiRequest(
    url,
    createAuthHeaders(newAccessToken),
    reportName
  );
  logger.info(QUICKBOOKS_REPORTS_LOGS.RETRY_SUCCESS, { reportName });

  return response;
};

/**
 * Process column data efficiently
 */
const processColumns = (columns, reportId, realmId) => {
  const colMap = new Map();
  const columnData = [];
  let colIndex = 0;

  columns.forEach((col) => {
    const processColData = (subCol, parentTitle = null) => {
      const columnInfo = {
        report_id: reportId,
        col_title: subCol.ColTitle || col.ColTitle,
        col_type:
          subCol.ColType ||
          col.ColType ||
          HARDCODED_STRINGS.REPORT_DEFAULTS.COL_TYPE,
        col_id: subCol.id || col.ColId || null,
        parent_col_id: null,
        col_order: colIndex,
        created_at: new Date(),
        updated_at: new Date(),
        parent_col_title: parentTitle,
        realm_id: realmId,
      };

      columnData.push(columnInfo);
      colMap.set(colIndex, {
        col_title: columnInfo.col_title,
        parent_col_title: parentTitle,
        col_type: columnInfo.col_type,
      });
      colIndex++;
    };

    if (col.ColData?.length) {
      const parentMeta = Object.fromEntries(
        (col.MetaData || []).map((m) => [m.Name, m.Value])
      );

      col.ColData.forEach((subCol) => {
        processColData(subCol, col.ColTitle);

        // Add period data for trial balance
        if (parentMeta.StartDate) {
          columnData[columnData.length - 1].period_start = formatDateOnly(
            parentMeta.StartDate
          );
          columnData[columnData.length - 1].period_end = formatDateOnly(
            parentMeta.EndDate
          );
        }
      });
    } else {
      processColData(col);
    }
  });

  return { columnData, colMap };
};

/**
 * Process row data efficiently - handles nested sections and flat data rows
 */
const processRows = (rows, reportId, realmId, colMap, rowDataTemplate) => {
  const rowData = [];
  let sectionCount = 0;
  let dataRowCount = 0;

  // Processing rows

  const processRowRecursively = (row, parentPath = "") => {
    // Handle nested sections
    if (row.type === "Section" && row.Rows?.Row) {
      sectionCount++;
      const sectionPath = parentPath
        ? `${parentPath} > ${row.Header?.ColData?.[0]?.value || ""}`
        : row.Header?.ColData?.[0]?.value || "";

      // Processing section

      // Process section header if it has data
      if (row.Header?.ColData?.length > 1) {
        const accountCol = row.Header.ColData[0];
        const accountId = accountCol?.id || null;
        const accountName = accountCol?.value || null;

        // Section header data processed

        row.Header.ColData.slice(1).forEach((colData, i) => {
          if (!colData?.value) return;

          const value = parseFloat(colData.value) || 0;
          if (value === 0) return;

          const columnIndex = i + 1;
          const columnInfo = colMap.get(columnIndex);

          if (columnInfo) {
            rowData.push({
              ...rowDataTemplate,
              report_id: reportId,
              account_name: accountName,
              column_index: columnIndex,
              value: value,
              created_at: new Date(),
              updated_at: new Date(),
              col_title: columnInfo.col_title,
              parent_col_title: columnInfo.parent_col_title,
              col_type: columnInfo.col_type,
              realm_id: realmId,
              path: sectionPath,

              // Conditional properties based on report type
              ...(rowDataTemplate.quickbooks_account_id !== undefined && {
                quickbooks_account_id: accountId,
              }),
              ...(rowDataTemplate.account_id !== undefined && {
                account_id: accountId,
              }),
            });
          }
        });
      }

      // Process nested rows recursively
      row.Rows.Row.forEach((nestedRow) => {
        processRowRecursively(nestedRow, sectionPath);
      });
    }
    // Handle data rows
    else if (
      row.type === HARDCODED_STRINGS.REPORT_DEFAULTS.ROW_TYPE_DATA &&
      row.ColData?.length
    ) {
      dataRowCount++;
      const accountCol = row.ColData[0];
      const accountId = accountCol?.id || null;
      const accountName = accountCol?.value || null;

      // Processing data row

      row.ColData.slice(1).forEach((colData, i) => {
        if (!colData?.value) return;

        const value = parseFloat(colData.value) || 0;
        if (value === 0) return;

        const columnIndex = i + 1;
        const columnInfo = colMap.get(columnIndex);

        if (columnInfo) {
          rowData.push({
            ...rowDataTemplate,
            report_id: reportId,
            account_name: accountName,
            column_index: columnIndex,
            value: value,
            created_at: new Date(),
            updated_at: new Date(),
            col_title: columnInfo.col_title,
            parent_col_title: columnInfo.parent_col_title,
            col_type: columnInfo.col_type,
            realm_id: realmId,
            path: parentPath,

            // Conditional properties based on report type
            ...(rowDataTemplate.quickbooks_account_id !== undefined && {
              quickbooks_account_id: accountId,
            }),
            ...(rowDataTemplate.account_id !== undefined && {
              account_id: accountId,
            }),
          });
        }
      });
    }
  };

  // Process all rows (both flat and nested)
  rows.forEach((row) => {
    processRowRecursively(row);
  });

  // Row processing complete

  return rowData;
};

/**
 * Save report data with optimized batch processing
 */
const saveReportData = async (
  mappedData,
  createReportFn,
  createColumnsFn,
  createRowsFn,
  reportType
) => {
  const transaction = await reportsRepository.createTransaction();

  try {
    logger.info(QUICKBOOKS_REPORTS_LOGS.SAVING_DATA, {
      reportType,
      columnsCount: mappedData.columnData.length,
      rowsCount: mappedData.rowData.length,
    });

    // Create report
    const report = await createReportFn(mappedData.reportData, { transaction });

    // Create columns with mapping
    const columnMap = new Map();
    const columnPromises = mappedData.columnData.map(async (column, index) => {
      const [columnRecord] = (await reportsRepository[
        `findOrCreate${reportType}Column`
      ]?.(
        {
          report_id: report.id,
          col_title: column.col_title,
          col_type: column.col_type,
          col_order: column.col_order,
        },
        {
          ...column,
          report_id: report.id,
        },
        { transaction }
      )) || [
        await createColumnsFn([{ ...column, report_id: report.id }], {
          transaction,
        }),
      ];

      columnMap.set(index, columnRecord.id);
      return columnRecord;
    });

    await Promise.all(columnPromises);

    // Prepare and create rows in batches
    const rowsToCreate = mappedData.rowData
      .map((row) => {
        const columnId = Array.from(columnMap.entries()).find(([index, _]) => {
          const originalColumn = mappedData.columnData[index];
          return (
            originalColumn.col_title === row.col_title &&
            originalColumn.parent_col_title === row.parent_col_title &&
            originalColumn.col_type === row.col_type
          );
        })?.[1];

        return columnId
          ? { ...row, report_id: report.id, column_id: columnId }
          : null;
      })
      .filter(Boolean);

    // Batch insert rows
    const batchPromises = [];
    for (let i = 0; i < rowsToCreate.length; i += BATCH_SIZE) {
      const batch = rowsToCreate.slice(i, i + BATCH_SIZE);
      batchPromises.push(createRowsFn(batch, { transaction }));
    }

    await Promise.all(batchPromises);
    await reportsRepository.commitTransaction(transaction);

    logger.info(QUICKBOOKS_REPORTS_LOGS.SAVE_SUCCESS, {
      reportType,
      reportId: report.id,
      columnsCount: mappedData.columnData.length,
      rowsCount: rowsToCreate.length,
    });

    return {
      reportId: report.id,
      columnsCount: mappedData.columnData.length,
      rowsCount: rowsToCreate.length,
    };
  } catch (error) {
    await reportsRepository.rollbackTransaction(transaction);
    logger.error(QUICKBOOKS_REPORTS_LOGS.SAVE_FAILED, {
      reportType,
      error: error.message,
    });
    throw error;
  }
};

export const reportsService = {
  /**
   * Fetch balance sheet data from QuickBooks API
   */
  async fetchBalanceSheet(
    startDate,
    endDate,
    quickbookAccount,
    quickBookAccessToken = null
  ) {
    try {
      const ACCESS_TOKEN =
        quickBookAccessToken || (await decrypt(quickbookAccount.access_token));
      const url = getQuickbooksApiUrl(
        `company/${
          quickbookAccount.realm_id
        }/reports/BalanceSheet?start_date=${encodeURIComponent(
          startDate
        )}&end_date=${encodeURIComponent(
          endDate
        )}&summarize_column_by=Total&minorversion=75`
      );

      logger.info("Fetching Balance Sheet from QuickBooks", {
        startDate,
        endDate,
        realmId: quickbookAccount.realm_id,
        url,
      });

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        timeout: API_CONFIG.timeout,
      });

      logger.info("Balance Sheet fetched successfully", {
        dataSize: JSON.stringify(response.data).length,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch Balance Sheet", {
        error: error.message,
        status: error.response?.status,
        startDate,
        endDate,
      });
      throw error;
    }
  },

  /**
   * Fetch P&L data directly from QuickBooks API
   */
  async fetchProfitLoss(
    startDate,
    endDate,
    quickbookAccount,
    quickBookAccessToken = null
  ) {
    try {
      const ACCESS_TOKEN =
        quickBookAccessToken || (await decrypt(quickbookAccount.access_token));
      const url = getQuickbooksApiUrl(
        `company/${
          quickbookAccount.realm_id
        }/reports/ProfitAndLoss?start_date=${encodeURIComponent(
          startDate
        )}&end_date=${encodeURIComponent(
          endDate
        )}&summarize_column_by=Total&minorversion=75`
      );

      logger.info("Fetching P&L from QuickBooks", {
        startDate,
        endDate,
        realmId: quickbookAccount.realm_id,
        url,
      });

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        timeout: API_CONFIG.timeout,
      });

      logger.info("P&L fetched successfully", {
        dataSize: JSON.stringify(response.data).length,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch P&L", {
        error: error.message,
        status: error.response?.status,
        startDate,
        endDate,
      });
      throw error;
    }
  },

  /**
   * Fetch Cash Flow data directly from QuickBooks API
   */
  async fetchCashFlow(
    startDate,
    endDate,
    quickbookAccount,
    quickBookAccessToken = null
  ) {
    try {
      const ACCESS_TOKEN =
        quickBookAccessToken || (await decrypt(quickbookAccount.access_token));
      const url = getQuickbooksApiUrl(
        `company/${
          quickbookAccount.realm_id
        }/reports/CashFlow?start_date=${encodeURIComponent(
          startDate
        )}&end_date=${encodeURIComponent(
          endDate
        )}&summarize_column_by=Total&minorversion=75`
      );

      logger.info("Fetching Cash Flow from QuickBooks", {
        startDate,
        endDate,
        realmId: quickbookAccount.realm_id,
        url,
      });

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        timeout: API_CONFIG.timeout,
      });

      logger.info("Cash Flow fetched successfully", {
        dataSize: JSON.stringify(response.data).length,
      });

      return response.data;
    } catch (error) {
      logger.error("Failed to fetch Cash Flow", {
        error: error.message,
        status: error.response?.status,
        startDate,
        endDate,
      });
      throw error;
    }
  },

  /**
   * Get report data from QuickBooks API with retry logic
   */
  async getReportDataFromQuickBooks(
    quickbookAccount,
    startDate,
    endDate,
    reportName,
    quickBookAccessToken = null
  ) {
    const ACCESS_TOKEN =
      quickBookAccessToken || (await decrypt(quickbookAccount.access_token));
    const url = getQuickbooksApiUrl(
      `company/${quickbookAccount.realm_id}/reports/${reportName}?start_date=${startDate}&end_date=${endDate}&summarize_column_by=Month&minorversion=75`
    );

    // QuickBooks API request

    logger.info(QUICKBOOKS_REPORTS_LOGS.FETCHING, {
      reportName,
      startDate,
      endDate,
      realmId: quickbookAccount.realm_id,
      url,
    });

    try {
      const response = await executeApiRequest(
        url,
        createAuthHeaders(ACCESS_TOKEN),
        reportName
      );

      // QuickBooks API response received

      return response;
    } catch (error) {
      // QuickBooks API error

      // Only retry on unauthorized errors
      if (error.response?.status === status.STATUS_CODE_UNAUTHORIZED) {
        return await handleTokenRetry(
          quickbookAccount,
          reportName,
          startDate,
          endDate
        );
      }
      throw error;
    }
  },

  /**
   * Map trial balance data with optimized processing
   */
  mapTrialBalanceToOptimizedStructure(
    quickbooksData,
    reportId,
    realmId,
    fallbackStartDate = null,
    fallbackEndDate = null
  ) {
    try {
      const header = quickbooksData.QueryResponse?.Header || {};
      const { startDate: startPeriod, endDate: endPeriod } =
        createValidatedDateRange(
          header.StartPeriod,
          header.EndPeriod,
          fallbackStartDate,
          fallbackEndDate
        );

      const reportData = {
        time: header.Time ? new Date(header.Time) : new Date(),
        report_name:
          header.ReportName ||
          HARDCODED_STRINGS.REPORT_DEFAULTS.REPORT_NAME_TRIAL_BALANCE,
        report_basis:
          header.ReportBasis || HARDCODED_STRINGS.REPORT_DEFAULTS.REPORT_BASIS,
        start_period: startPeriod,
        end_period: endPeriod,
        summarize_columns_by:
          header.SummarizeColumnsBy ||
          HARDCODED_STRINGS.REPORT_DEFAULTS.SUMMARIZE_COLUMNS_BY,
        currency: header.Currency || HARDCODED_STRINGS.REPORT_DEFAULTS.CURRENCY,
        realm_id: realmId,
      };

      const columns = quickbooksData.QueryResponse?.Columns?.Column || [];
      const { columnData, colMap } = processColumns(columns, reportId, realmId);

      const rows = quickbooksData.QueryResponse?.Rows?.Row || [];
      const rowDataTemplate = {
        quickbooks_account_id: null,
        acct_num: null,
        class_id: null,
        account_type: null,
      };
      const rowData = processRows(
        rows,
        reportId,
        realmId,
        colMap,
        rowDataTemplate
      );

      logger.info(QUICKBOOKS_REPORTS_LOGS.MAPPING_SUCCESS, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
        columnsCount: columnData.length,
        rowsCount: rowData.length,
      });

      return { reportData, columnData, rowData };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.MAPPING_FAILED, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Map profit & loss data using new schema structure
   */
  async mapProfitLossToOptimizedStructure(
    quickbooksData,
    reportId,
    realmId,
    fallbackStartDate = null,
    fallbackEndDate = null
  ) {
    try {
      // Process the P&L data using the new utility functions
      const result = await processPnLData(quickbooksData, realmId);

      // Return in the expected format for the controller
      return {
        reportData: {
          id: result.reportId,
          realm_id: realmId,
          linesCount: result.totals ? Object.keys(result.totals).length : 0,
          summariesCount: result.balanceCheck ? 1 : 0,
          totals: result.totals,
          balanceCheck: result.balanceCheck,
        },
        columnData: [], // Not used in new schema
        rowData: [], // Not used in new schema
        processingResult: result,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.MAPPING_FAILED, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Map balance sheet data using new schema structure
   */
  async mapBalanceSheetToOptimizedStructure(
    quickbooksData,
    reportId,
    realmId,
    fallbackStartDate = null,
    fallbackEndDate = null
  ) {
    try {
      // Process the balance sheet data using the new utility functions
      const result = await processBalanceSheetData(quickbooksData, realmId);

      // Return in the expected format for the controller
      return {
        reportData: {
          id: result.reportId,
          realm_id: realmId,
          lineItemsCount: result.lineItemsCount,
          summariesCount: result.summariesCount,
          totals: result.totals,
        },
        columnData: [], // Not used in new schema
        rowData: [], // Not used in new schema
        processingResult: result,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.MAPPING_FAILED, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Map cash flow data using new schema structure
   */
  async mapCashFlowToOptimizedStructure(
    quickbooksData,
    reportId,
    realmId,
    fallbackStartDate = null,
    fallbackEndDate = null
  ) {
    try {
      // Process the cash flow data using the new utility functions
      const result = await processCashFlowData(quickbooksData, realmId);

      // Return in the expected format for the controller
      return {
        reportData: {
          id: result.reportId,
          realm_id: realmId,
          linesCount: result.linesCount,
          totals: result.totals,
        },
        columnData: [], // Not used in new schema
        rowData: [], // Not used in new schema
        processingResult: result,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.MAPPING_FAILED, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Save trial balance data with optimized structure
   */

  async saveTrialBalanceData(mappedData) {
    // Starting Trial Balance data save

    const result = await saveReportData(
      mappedData,
      reportsRepository.createTrialBalanceReport,
      reportsRepository.createTrialBalanceColumns,
      reportsRepository.createTrialBalanceRows,
      HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE
    );

    // Main Trial Balance data saved

    // Process Trial Balance lines with insertLines function
    if (result?.reportId && mappedData?.rowData) {
      try {
        // Process Trial Balance lines with insertLines

        // Create account map from row data
        const accountMap = new Map();
        mappedData.rowData.forEach((row) => {
          if (row.quickbooks_account_id && row.account_name) {
            accountMap.set(String(row.quickbooks_account_id), row.account_name);
          }
        });

        // Account map created

        // Get database name from environment or use default
        const databaseName = process.env.LOCAL_DB_NAME;

        // Database configuration ready

        // Insert Trial Balance lines
        const realmId = mappedData.reportData.realm_id;
        await insertTrialBalanceLines(
          result.reportId,
          mappedData.rowData,
          accountMap,
          databaseName,
          realmId
        );

        // Trial Balance lines inserted successfully

        logger.info(QUICKBOOKS_REPORTS_LOGS.PROCESSING_SUCCESS, {
          reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
          linesProcessed: mappedData.rowData.length,
        });
      } catch (error) {
        // Trial Balance lines insert error

        logger.error(QUICKBOOKS_REPORTS_LOGS.PROCESSING_ERROR, {
          error: error.message,
          reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
        });
        // Don't throw error to avoid breaking the main flow
      }
    }

    return result;
  },

  /**
   * Save profit & loss data using new schema structure
   */
  async saveProfitLossData(mappedData) {
    try {
      // The data is already processed and saved in the mapping function
      // Just return the processing result
      const processingResult = mappedData.processingResult;

      logger.info(QUICKBOOKS_REPORTS_LOGS.PROCESSING_SUCCESS, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
        reportId: processingResult.reportId,
        totals: processingResult.totals,
        balanceCheck: processingResult.balanceCheck,
      });

      return {
        reportId: processingResult.reportId,
        columnsCount: 0, // Not applicable in new schema
        rowsCount: processingResult.totals
          ? Object.keys(processingResult.totals).length
          : 0,
        totals: processingResult.totals,
        balanceCheck: processingResult.balanceCheck,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.PROCESSING_ERROR, {
        error: error.message,
        reportType: HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
      });
      throw error;
    }
  },

  /**
   * Save balance sheet data using new schema structure
   */
  async saveBalanceSheetData(mappedData) {
    try {
      // The data is already processed and saved in the mapping function
      // Just return the processing result
      const processingResult = mappedData.processingResult;

      logger.info(QUICKBOOKS_REPORTS_LOGS.PROCESSING_SUCCESS, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
        reportId: processingResult.reportId,
        lineItemsCount: processingResult.lineItemsCount,
        isBalanced: processingResult.totals.isBalanced,
      });

      return {
        reportId: processingResult.reportId,
        columnsCount: 0, // Not applicable in new schema
        rowsCount: processingResult.lineItemsCount,
        totals: processingResult.totals,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.PROCESSING_ERROR, {
        error: error.message,
        reportType: HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
      });
      throw error;
    }
  },

  /**
   * Save cash flow data using new schema structure
   */
  async saveCashFlowData(mappedData) {
    try {
      // The data is already processed and saved in the mapping function
      // Just return the processing result
      const processingResult = mappedData.processingResult;

      logger.info(QUICKBOOKS_REPORTS_LOGS.PROCESSING_SUCCESS, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
        reportId: processingResult.reportId,
        linesCount: processingResult.linesCount,
        totals: processingResult.totals,
      });

      return {
        reportId: processingResult.reportId,
        columnsCount: 0, // Not applicable in new schema
        rowsCount: processingResult.linesCount,
        totals: processingResult.totals,
      };
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.PROCESSING_ERROR, {
        error: error.message,
        reportType: HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
      });
      throw error;
    }
  },

  // Report retrieval operations

  async getTrialBalanceReportsByRealmId(realmId, options = {}) {
    try {
      return await reportsRepository.findTrialBalanceReportsByRealmId(
        realmId,
        options
      );
    } catch (error) {
      logger.error(QUICKBOOKS_REPORTS_LOGS.RETRIEVAL_FAILED, {
        reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
        realmId,
        error: error.message,
      });
      throw error;
    }
  },

  async getProfitLossReportsByRealmId(realmId, options = {}) {
    try {
      return await getPnLReports(realmId, options);
    } catch (error) {
      logger.error(
        QUICKBOOKS_REPORTS_LOGS.RETRIEVAL_FAILED(
          HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
          error.message
        ),
        {
          reportType: HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
          realmId,
          error: error.message,
        }
      );
      throw error;
    }
  },

  async getBalanceSheetReportsByRealmId(realmId, options = {}) {
    try {
      return await getBalanceSheetReports(realmId, options);
    } catch (error) {
      logger.error(
        QUICKBOOKS_REPORTS_LOGS.RETRIEVAL_FAILED(
          HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
          error.message
        ),
        {
          reportType: HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
          realmId,
          error: error.message,
        }
      );
      throw error;
    }
  },

  async getCashFlowReportsByRealmId(realmId, options = {}) {
    try {
      return await getCashFlowReports(realmId, options);
    } catch (error) {
      logger.error(
        QUICKBOOKS_REPORTS_LOGS.RETRIEVAL_FAILED(
          HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
          error.message
        ),
        {
          reportType: HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
          realmId,
          error: error.message,
        }
      );
      throw error;
    }
  },
};

export default reportsService;

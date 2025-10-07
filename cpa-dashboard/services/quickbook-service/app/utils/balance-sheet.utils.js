import { BalanceSheetReport, BalanceSheetLineItem } from '../models/index.js';
import logger from '../../config/logger.config.js';

/**
 * Load account map from database
 * @returns {Promise<Map>} Map of account_id to account_name
 */
export async function loadAccountMap() {
  try {
    // This would need to be implemented based on your accounts table structure
    // For now, returning an empty map as placeholder
    const map = new Map();
    logger.info('Account map loaded', { count: map.size });
    return map;
  } catch (error) {
    logger.error('Failed to load account map', { error: error.message });
    return new Map();
  }
}

/**
 * Flatten balance sheet data from QuickBooks API response
 * @param {Object} balanceSheet - QuickBooks balance sheet response
 * @returns {Object} Flattened data with flat array and summaries
 */
export function flattenBalanceSheet(balanceSheet) {
  const flat = [];
  const summaries = [];

  function traverse(rows, pathPrefix = "", section = "", subsection = "", accountType = "") {
    if (!rows || !Array.isArray(rows)) return;

    for (const row of rows) {
      if (row.Header && row.Rows) {
        // This is a section header with sub-rows
        const headerValue = row.Header.ColData?.[0]?.value || "";
        const newPath = pathPrefix ? `${pathPrefix} > ${headerValue}` : headerValue;
        
        // Determine section/subsection/account type based on header value
        let newSection = section;
        let newSubsection = subsection;
        let newAccountType = accountType;
        
        if (headerValue === "ASSETS" || headerValue === "LIABILITIES AND EQUITY") {
          newSection = headerValue;
        } else if (headerValue === "Liabilities" || headerValue === "Equity") {
          newSection = headerValue;
        } else if (headerValue.includes("Assets") || headerValue.includes("Liabilities")) {
          newSubsection = headerValue;
        } else {
          newAccountType = headerValue;
        }

        traverse(row.Rows.Row, newPath, newSection, newSubsection, newAccountType);

        // Add summary if present
        if (row.Summary && row.Summary.ColData) {
          const summaryLabel = row.Summary.ColData[0]?.value || "";
          const summaryAmount = parseFloat(row.Summary.ColData[1]?.value || "0");
          summaries.push({
            group: row.group || "",
            label: summaryLabel,
            path: newPath,
            amount: summaryAmount,
          });
        }
      } else if (row.ColData && row.type === "Data") {
        // This is a leaf data row
        const accountName = row.ColData[0]?.value || "";
        const accountId = row.ColData[0]?.id || null;
        const amount = parseFloat(row.ColData[1]?.value || "0");

        flat.push({
          path: pathPrefix,
          account_name: accountName,
          account_id: accountId,
          amount: amount,
          section: section,
          subsection: subsection,
          account_type: accountType,
        });
      }
    }
  }

  const queryResponse = balanceSheet.QueryResponse || balanceSheet;
  const report = queryResponse.Report || queryResponse;
  
  if (report.Rows && report.Rows.Row) {
    traverse(report.Rows.Row);
  }

  return { flat, summaries };
}

/**
 * Transform flattened data to PowerBI KPI format
 * @param {Array} flat - Flattened balance sheet data
 * @param {Map} accountMap - Account ID to name mapping
 * @returns {Object} PowerBI KPI JSON structure
 */
export function transformToPowerBIKPI(flat, accountMap) {
  const kpi = {
    report_type: "BalanceSheet",
    generated_at: new Date().toISOString(),
    sections: {
      assets: {
        current_assets: {},
        fixed_assets: {},
        other_assets: {},
        total: 0,
      },
      liabilities: {
        current_liabilities: {},
        long_term_liabilities: {},
        total: 0,
      },
      equity: {
        total: 0,
        line_items: {},
      },
    },
    totals: {
      total_assets: 0,
      total_liabilities_and_equity: 0,
    },
  };

  for (const item of flat) {
    const section = item.section?.toLowerCase() || "";
    const subsection = item.subsection?.toLowerCase() || "";
    const accountName = accountMap.get(item.account_id) || item.account_name;

    if (section.includes("assets")) {
      if (subsection.includes("current")) {
        kpi.sections.assets.current_assets[accountName] = item.amount;
      } else if (subsection.includes("fixed")) {
        kpi.sections.assets.fixed_assets[accountName] = item.amount;
      } else {
        kpi.sections.assets.other_assets[accountName] = item.amount;
      }
      kpi.sections.assets.total += item.amount;
      kpi.totals.total_assets += item.amount;
    } else if (section.includes("liabilities")) {
      if (subsection.includes("current")) {
        kpi.sections.liabilities.current_liabilities[accountName] = item.amount;
      } else {
        kpi.sections.liabilities.long_term_liabilities[accountName] = item.amount;
      }
      kpi.sections.liabilities.total += item.amount;
      kpi.totals.total_liabilities_and_equity += item.amount;
    } else if (section.includes("equity")) {
      kpi.sections.equity.line_items[accountName] = item.amount;
      kpi.sections.equity.total += item.amount;
      kpi.totals.total_liabilities_and_equity += item.amount;
    }
  }

  return kpi;
}

/**
 * Insert report header into balance_sheet_reports table
 * @param {Object} balanceSheet - QuickBooks balance sheet response
 * @param {Object} powerbiKpiJson - PowerBI KPI JSON
 * @param {string} realmId - Realm ID
 * @returns {Promise<number>} Report ID
 */
export async function insertReportHeader(balanceSheet, powerbiKpiJson, realmId) {
  try {
    const queryResponse = balanceSheet.QueryResponse || balanceSheet;
    const report = queryResponse.Report || queryResponse;
    const header = report.Header || {};

    const reportName = header.ReportName || "BalanceSheet";
    const reportBasis = header.ReportBasis || "Cash";
    const startDate = header.StartPeriod || null;
    const endDate = header.EndPeriod || null;
    const currency = header.Currency || "USD";
    const accountingStandard = header.Option?.find(opt => opt.Name === "AccountingStandard")?.Value || "GAAP";
    const generatedAt = header.Time ? new Date(header.Time) : new Date();

    const reportData = {
      report_name: reportName,
      report_basis: reportBasis,
      start_date: startDate,
      end_date: endDate,
      currency: currency,
      accounting_standard: accountingStandard,
      generated_at: generatedAt,
      raw: balanceSheet,
      powerbi_kpi_json: powerbiKpiJson,
      realm_id: realmId,
    };

    const result = await BalanceSheetReport.create(reportData);
    
    logger.info('Balance sheet report header inserted', {
      reportId: result.id,
      reportName,
      startDate,
      endDate,
    });

    return result.id;
  } catch (error) {
    logger.error('Failed to insert balance sheet report header', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Insert line items into balance_sheet_line_items table
 * @param {number} reportId - Report ID
 * @param {Array} flat - Flattened balance sheet data
 * @param {Map} accountMap - Account ID to name mapping
 * @param {string} realmId - Realm ID
 * @returns {Promise<void>}
 */
export async function insertLineItems(reportId, flat, accountMap, realmId) {
  if (!flat.length) {
    logger.warn('No line items to insert', { reportId });
    return;
  }

  try {
    const prepared = flat.map((row) => ({
      report_id: reportId,
      path: row.path,
      account_name: accountMap.get(row.account_id) || row.account_name,
      account_id: row.account_id,
      amount: row.amount,
      section: row.section,
      subsection: row.subsection,
      account_type: row.account_type,
      realm_id: realmId,
    }));

    // Insert in batches to avoid query size limits
    const batchSize = 1000;
    for (let i = 0; i < prepared.length; i += batchSize) {
      const batch = prepared.slice(i, i + batchSize);
      await BalanceSheetLineItem.bulkCreate(batch);
    }

    logger.info('Balance sheet line items inserted', {
      reportId,
      count: prepared.length,
    });
  } catch (error) {
    logger.error('Failed to insert balance sheet line items', {
      error: error.message,
      reportId,
      count: flat.length,
    });
    throw error;
  }
}

/**
 * Process and save balance sheet data using new schema
 * @param {Object} balanceSheet - QuickBooks balance sheet response
 * @param {string} realmId - Realm ID
 * @returns {Promise<Object>} Processing result
 */
export async function processBalanceSheetData(balanceSheet, realmId) {
  try {
    logger.info('Processing balance sheet data', { realmId });

    // 1) Flatten the data
    const { flat, summaries } = flattenBalanceSheet(balanceSheet);
    logger.info('Balance sheet data flattened', {
      flatCount: flat.length,
      summariesCount: summaries.length,
    });

    // 2) Load account map
    const accountMap = await loadAccountMap();

    // 3) Transform to PowerBI KPI format
    const powerbiKpiJson = transformToPowerBIKPI(flat, accountMap);
    logger.info('PowerBI KPI JSON generated');

    // 4) Insert report header
    const reportId = await insertReportHeader(balanceSheet, powerbiKpiJson, realmId);

    // 5) Insert line items
    await insertLineItems(reportId, flat, accountMap, realmId);

    // 6) Calculate totals for validation
    const totalAssets = flat
      .filter((r) => (r.section || "").toLowerCase().includes("assets"))
      .reduce((a, r) => a + (Number.isFinite(r.amount) ? r.amount : 0), 0);
    
    const totalLiabilities = flat
      .filter((r) => (r.section || "").toLowerCase().includes("liabilities"))
      .reduce((a, r) => a + (Number.isFinite(r.amount) ? r.amount : 0), 0);
    
    const totalEquity = flat
      .filter((r) => (r.section || "").toLowerCase().includes("equity"))
      .reduce((a, r) => a + (Number.isFinite(r.amount) ? r.amount : 0), 0);
    
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    const result = {
      reportId,
      lineItemsCount: flat.length,
      summariesCount: summaries.length,
      totals: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalLiabilitiesAndEquity,
        isBalanced,
      },
    };

    logger.info('Balance sheet processing completed', result);

    return result;
  } catch (error) {
    logger.error('Failed to process balance sheet data', {
      error: error.message,
      realmId,
    });
    throw error;
  }
}

/**
 * Get balance sheet reports by realm ID
 * @param {string} realmId - Realm ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Balance sheet reports
 */
export async function getBalanceSheetReportsByRealmId(realmId, options = {}) {
  try {
    const { limit = 10, offset = 0, order = 'created_at DESC' } = options;
    
    const reports = await BalanceSheetReport.findAll({
      where: { realm_id: realmId },
      include: [{
        model: BalanceSheetLineItem,
        as: 'lineItems',
        required: false,
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[order.split(' ')[0], order.split(' ')[1] || 'ASC']],
    });

    logger.info('Balance sheet reports retrieved', {
      realmId,
      count: reports.length,
    });

    return reports;
  } catch (error) {
    logger.error('Failed to get balance sheet reports', {
      error: error.message,
      realmId,
    });
    throw error;
  }
}

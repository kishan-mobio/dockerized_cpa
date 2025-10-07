import { createKnexInstance } from "../services/quickbooks.service.js";
import { REPORT_CONSTANTS } from "./constants/reports.constants.js";

export async function insertLines(
  reportId,
  rows,
  accountMap,
  databaseName,
  realmId = "default_realm"
) {
  // Logging handled by calling service

  if (!rows.length) {
    return;
  }
  
  // The rows coming from reports service are already processed and have the structure:
  // { report_id, account_name, column_index, value, col_title, parent_col_title, col_type, realm_id, path, account_id }

  // Filter only rows with values (non-zero amounts)
  const dataRows = rows.filter(
    (row) =>
      row.value !== null &&
      row.value !== undefined &&
      row.value !== 0 &&
      row.account_name // Must have account name
  );

  if (!dataRows.length) {
    return;
  }

  // Map account_id -> account_name; fallback to existing account_name
  const prepared = dataRows.map((row) => {
    // Get account name from map or use existing account_name
    const accountName =
      row.account_id && accountMap.get(row.account_id)
        ? accountMap.get(row.account_id)
        : row.account_name;

    return {
      path: row.path || "",
      account_name: accountName,
      account_id: row.account_id,
      amount: row.value, // Use the value from the processed row
      category: getCategoryForAccount(accountName),
    };
  });

  const db = await createKnexInstance(databaseName);
  
  // Get unique column information from the data
  const uniqueColumns = new Map();
  dataRows.forEach((row) => {
    if (row.col_title && row.col_type) {
      const key = `${row.col_title}_${row.col_type}`;
      if (!uniqueColumns.has(key)) {
        uniqueColumns.set(key, {
          col_title: row.col_title,
          col_type: row.col_type,
          parent_col_title: row.parent_col_title || null,
          col_order: row.column_index || 0,
        });
      }
    }
  });

  // Create columns dynamically based on the data
  const columnMap = new Map();
  for (const [key, colData] of uniqueColumns) {
    let column = await db("trial_balance_columns")
      .where({
        report_id: reportId,
        col_title: colData.col_title,
        col_type: colData.col_type,
      })
    .first();
  
    if (!column) {
      const [newColumn] = await db("trial_balance_columns")
        .insert({
          report_id: reportId,
          col_title: colData.col_title,
          col_type: colData.col_type,
          parent_col_title: colData.parent_col_title,
          col_order: colData.col_order,
          realm_id: realmId,
        })
        .returning("id");
      column = newColumn;
    }

    columnMap.set(key, column.id);
  }

  // If no columns found, create a default one based on first available data
  if (columnMap.size === 0) {
    const defaultColTitle =
      dataRows.length > 0 && dataRows[0].col_title
        ? dataRows[0].col_title
        : REPORT_CONSTANTS.DEFAULT_COLUMN.TITLE;
    const defaultColType =
      dataRows.length > 0 && dataRows[0].col_type
        ? dataRows[0].col_type
        : REPORT_CONSTANTS.DEFAULT_COLUMN.TYPE;

    const [defaultColumn] = await db("trial_balance_columns")
      .insert({
        report_id: reportId,
        col_title: defaultColTitle,
        col_type: defaultColType,
        col_order: 0,
        realm_id: realmId,
      })
      .returning("id");
    columnMap.set("default", defaultColumn.id);
  }

  // Insert data using Knex.js into trial_balance_rows table
  const insertData = prepared.map((row, index) => {
    // Find the appropriate column_id based on the row's column information
    let columnId = columnMap.get("default"); // Default fallback

    if (row.col_title && row.col_type) {
      const key = `${row.col_title}_${row.col_type}`;
      columnId = columnMap.get(key) || columnId;
    }

    return {
      report_id: reportId,
      path: row.path,
      account_name: row.account_name,
      account_id: row.account_id,
      value: row.amount, // Map amount to value field
      category: row.category,
      realm_id: realmId, // Use provided realm_id
      column_id: columnId, // Use the dynamic column_id
      // created_at and updated_at will be set automatically by database defaults
    };
  });

  // Insert data in batches to avoid query size limits
  const batchSize = REPORT_CONSTANTS.BATCH_SIZE;
  try {
    for (let i = 0; i < insertData.length; i += batchSize) {
      const batch = insertData.slice(i, i + batchSize);
      await db("trial_balance_rows").insert(batch);
    }
  } catch (error) {
    throw new Error(`Failed to insert Trial Balance data: ${error.message}`);
  } finally {
    await db.destroy();
  }
}

export function getCategoryForAccount(accountName) {
  if (!accountName) return null;

  // Assets
  if (
    accountName.toLowerCase().includes("cash") ||
    accountName.toLowerCase().includes("bank") ||
    accountName.toLowerCase().includes("checking") ||
    accountName.toLowerCase().includes("savings")
  ) {
    return "Cash & Cash Equivalents";
  }

  if (
    accountName.toLowerCase().includes("receivable") ||
    accountName.toLowerCase().includes("ar")
  ) {
    return "Accounts Receivable";
  }

  if (accountName.toLowerCase().includes("inventory")) {
    return "Inventory";
  }

  if (accountName.toLowerCase().includes("prepaid")) {
    return "Prepaid Expenses";
  }

  if (
    accountName.toLowerCase().includes("equipment") ||
    accountName.toLowerCase().includes("furniture") ||
    accountName.toLowerCase().includes("vehicle") ||
    accountName.toLowerCase().includes("building") ||
    accountName.toLowerCase().includes("land")
  ) {
    return "Fixed Assets";
  }

  // Liabilities
  if (
    accountName.toLowerCase().includes("payable") ||
    accountName.toLowerCase().includes("ap")
  ) {
    return "Accounts Payable";
  }

  if (accountName.toLowerCase().includes("credit card")) {
    return "Credit Card Payable";
  }

  if (
    accountName.toLowerCase().includes("loan") ||
    accountName.toLowerCase().includes("debt") ||
    accountName.toLowerCase().includes("mortgage")
  ) {
    return "Long Term Debt";
  }

  // Equity
  if (
    accountName.toLowerCase().includes("equity") ||
    accountName.toLowerCase().includes("capital") ||
    accountName.toLowerCase().includes("retained earnings") ||
    accountName.toLowerCase().includes("owner")
  ) {
    return "Owner's Equity";
  }

  // Revenue
  if (
    accountName.toLowerCase().includes("revenue") ||
    accountName.toLowerCase().includes("income") ||
    accountName.toLowerCase().includes("sales")
  ) {
    return "Revenue";
  }

  // Expenses
  if (
    accountName.toLowerCase().includes("expense") ||
    accountName.toLowerCase().includes("cost") ||
    accountName.toLowerCase().includes("payroll") ||
    accountName.toLowerCase().includes("salary")
  ) {
    return "Operating Expenses";
  }

  return "Other"; // Default category
}

/**
 * Process QuickBooks Trial Balance hierarchical data structure
 * @param {Object} reportData - Raw QuickBooks report data
 * @returns {Array} Flattened array of processed rows
 */
export function processTrialBalanceHierarchy(reportData) {
  const processedRows = [];
  
  if (!reportData.Rows || !reportData.Rows.Row) {
    return processedRows;
  }

  function processRows(rows, parentPath = '') {
    if (!Array.isArray(rows)) {
      rows = [rows];
    }

    rows.forEach((row, index) => {
      const currentPath = parentPath ? `${parentPath}.${index}` : `${index}`;
      
      // Process data rows (accounts with debit/credit values)
      if (row.ColData && Array.isArray(row.ColData)) {
        const accountName = row.ColData[0]?.value || '';
        const accountId = row.ColData[0]?.id || null;
        
        // Process each column (month) for this account
        // Trial balance has Debit/Credit pairs for each month
        row.ColData.forEach((colData, colIndex) => {
          if (colIndex > 0 && colData.value && colData.value !== '' && colData.value !== '0') {
            // Parse numeric value
            const numericValue = parseFloat(colData.value);
            if (!isNaN(numericValue)) {
              // Determine if this is a debit or credit column
              const isDebit = colIndex % 2 === 1; // Odd indices are debits, even are credits
              const monthIndex = Math.floor((colIndex - 1) / 2); // Calculate which month this is
              
              processedRows.push({
                path: currentPath,
                account_name: accountName,
                account_id: accountId,
                value: numericValue,
                col_title: reportData.Columns?.Column?.[monthIndex + 1]?.ColTitle || '',
                col_type: reportData.Columns?.Column?.[monthIndex + 1]?.ColType || 'Money',
                parent_col_title: isDebit ? 'Debit' : 'Credit',
                column_index: colIndex,
                row_type: 'Data'
              });
            }
          }
        });
      }

      // Process nested rows
      if (row.Rows && row.Rows.Row) {
        processRows(row.Rows.Row, currentPath);
      }
    });
  }

  processRows(reportData.Rows.Row);
  return processedRows;
}

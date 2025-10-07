import { PnLReport, PnLLine, PnLSummary } from '../models/index.js';
import logger from '../../config/logger.config.js';

function parseAmount(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/,/g, "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function flattenPnL(pnlJson) {
  const flat = [];
  const summaries = [];

  function walkRows(node, pathParts = []) {
    if (!node) return;
    const rows = node.Row || [];
    for (const r of rows) {
      const rType = r.type;

      // extend path via Header label
      let newPath = pathParts.slice();
      if (r.Header?.ColData?.length) {
        const headerLabel = r.Header.ColData[0]?.value || "";
        if (headerLabel) newPath.push(headerLabel);
      }

      if (rType === "Data") {
        const cd = r.ColData || [];
        const rawName = cd[0]?.value || "";
        const acctId = cd[0]?.id ? String(cd[0].id) : null;
        const amount = parseAmount(cd[1]?.value);
        flat.push({
          path: newPath.join(" > "),
          account_label: rawName,
          account_id: acctId,
          amount,
        });
      }

      if (rType === "Section" && r.Summary?.ColData?.length >= 2) {
        const s = r.Summary.ColData;
        summaries.push({
          path: newPath.join(" > "),
          label: s[0]?.value || "",
          amount: parseAmount(s[1]?.value || ""),
          group: r.group || "",
        });
      }

      if (r.Rows) walkRows(r.Rows, newPath);
    }
  }

  walkRows(pnlJson?.Rows || {}, []);
  return { flat, summaries };
}

async function loadAccountMap() {
  // This would need to be implemented based on your account structure
  // For now, returning an empty map
  const map = new Map();
  return map;
}

function transformToPowerBIKPI(flat, accountMap) {
  // Initialize the PowerBI KPI structure
  const powerbiKpi = {
    "Operating Expenses": {
      "Cleaning - office": null,
      "Clinical Tool Licensure": null,
      "Equipment Maint. & Repair": null,
      "Legal & Accounting": null,
      "Medical Supplies": null,
      "Patient Notification Tools": null,
      "Office Expenses": null,
      "Practice Mgmt Software Lease": null,
      Rent: null,
      "Telephone Office": null,
      Utilities: null,
      Vaccines: null,
      "Website Expense": null,
      "Workmans Comp Ins": null,
      "Total Operating Expense": null,
    },
    Admin: {
      "Doctor Admin Income Expense - Canner": null,
      "Doctor Admin Income Expense - Ghosh": null,
      "Doctor Admin Income Expense - Pierce": null,
      "Doctor Admin Income Expense - Scherer": null,
      "Doctor Admin Income Expense - Shah": null,
      "Total Admin Expense": null,
    },
    "Dues, Subscriptions & License": {
      "Dues, Sub & Lic Deb Ghosh": null,
      "Dues, Subs & Lic - Dr. Canner": null,
      "Dues, Subs & Lic - Dr. George": null,
      "Dues, Subs & Lic - Dr. Pierce": null,
      "Dues, Subs & Lic - Dr. Scherer": null,
      "Dues, Subs & Lic - Dr. Shah": null,
      "Dues, Subs & Lic - Dr. Shaikh": null,
      "Total Dues, Subs & Lic": null,
    },
    "Payroll Tax Expense": {
      "Payroll Expenses": {
        "Payroll Tax - Associate Dr. Shaikh": null,
        "Payroll Tax - Dr. Canner": null,
        "Payroll Tax - Dr. Ghosh": null,
        "Payroll Tax - Dr. Pierce": null,
        "Payroll Tax - Dr. Scherer": null,
        "Payroll Tax - Dr. Shah": null,
        "Payroll Tax - Office Staff": null,
        "Total Payroll Tax": null,
      },
      "Salary Expense": {
        "Payroll - Office Staff": null,
        "Salary - Associate Dr. Shaikh": null,
        "Salary - Dr. Canner": null,
        "Salary - Dr. Ghosh": null,
        "Salary - Dr. Pierce": null,
        "Salary - Dr. Scherer": null,
        "Salary - Dr. Shah": null,
        "Total Salary": null,
      },
    },
    "Other Expenses": {
      "Bank Charge": null,
      "Meals & Entertainment": null,
      "Profit Sharing": null,
      Refunds: null,
      Reimbursement: null,
      "Service fee": null,
      "Interest Expense": null,
      "Total Other expense": null,
    },
    "Health Insurance Expense (Medical)": {
      "Health Insurance - B. Scherer": null,
      "Health Insurance - Employee": null,
      "Health Insurance - J. Canner": null,
      "Total Medical Expense": null,
    },
  };

  // Filter expense lines only
  const expenseLines = flat.filter((r) =>
    (r.path || "").startsWith("Expenses")
  );

  // Map each expense line to the appropriate category
  for (const line of expenseLines) {
    const accountName =
      line.account_id && accountMap.get(line.account_id)
        ? accountMap.get(line.account_id)
        : line.account_label;
    const amount = line.amount;

    // Map to PowerBI KPI structure based on account name
    mapExpenseToCategory(powerbiKpi, accountName, amount);
  }

  // Calculate totals for each category
  calculateCategoryTotals(powerbiKpi);

  return powerbiKpi;
}

/**
 * Get the category name for a given account name
 * @param {string} accountName - The account name to categorize
 * @returns {string|null} - The category name or null if not categorized
 */
function getCategoryForAccount(accountName) {
  if (!accountName) return null;

  // Operating Expenses
  if (
    [
      "Cleaning - office",
      "Clinical Tool Licensure",
      "Equipment Maint. & Repair",
      "Legal & Accounting",
      "Medical Supplies",
      "Patient Notification Tools",
      "Office Expenses",
      "Practice Mgmt Software Lease",
      "Rent",
      "Telephone Office",
      "Utilities",
      "Vaccines",
      "Website Expense",
      "Workmans Comp Ins",
    ].includes(accountName)
  ) {
    return "Operating Expenses";
  }

  // Admin
  if (
    [
      "Doctor Admin Income Expense - Canner",
      "Doctor Admin Income Expense - Ghosh",
      "Doctor Admin Income Expense - Pierce",
      "Doctor Admin Income Expense - Scherer",
      "Doctor Admin Income Expense - Shah",
    ].includes(accountName)
  ) {
    return "Admin";
  }

  // Dues, Subscriptions & License
  if (
    [
      "Dues, Sub & Lic Deb Ghosh",
      "Dues, Subs & Lic - Dr. Canner",
      "Dues, Subs & Lic - Dr. George",
      "Dues, Subs & Lic - Dr. Pierce",
      "Dues, Subs & Lic - Dr. Scherer",
      "Dues, Subs & Lic - Dr. Shah",
      "Dues, Subs & Lic - Dr. Shaikh",
    ].includes(accountName)
  ) {
    return "Dues, Subscriptions & License";
  }

  // Payroll Tax Expense (includes both Payroll Expenses and Salary Expense)
  if (
    [
      "Payroll Tax - Associate Dr. Shaikh",
      "Payroll Tax - Dr. Canner",
      "Payroll Tax - Dr. Ghosh",
      "Payroll Tax - Dr. Pierce",
      "Payroll Tax - Dr. Scherer",
      "Payroll Tax - Dr. Shah",
      "Payroll Tax - Office Staff",
      "Payroll - Office Staff",
      "Salary - Associate Dr. Shaikh",
      "Salary - Dr. Canner",
      "Salary - Dr. Ghosh",
      "Salary - Dr. Pierce",
      "Salary - Dr. Scherer",
      "Salary - Dr. Shah",
    ].includes(accountName)
  ) {
    return "Payroll Tax Expense";
  }

  // Other Expenses
  if (
    [
      "Bank Charge",
      "Meals & Entertainment",
      "Profit Sharing",
      "Refunds",
      "Reimbursement",
      "Service fee",
      "Interest Expense",
    ].includes(accountName)
  ) {
    return "Other Expenses";
  }

  // Health Insurance Expense (Medical)
  if (
    [
      "Health Insurance - B. Scherer",
      "Health Insurance - Employee",
      "Health Insurance - J. Canner",
    ].includes(accountName)
  ) {
    return "Health Insurance Expense (Medical)";
  }

  return "Miscellaneous"; // No category found
}

function mapExpenseToCategory(powerbiKpi, accountName, amount) {
  if (!accountName || amount === null || amount === undefined) return;

  // Operating Expenses mapping
  if (accountName === "Cleaning - office") {
    powerbiKpi["Operating Expenses"]["Cleaning - office"] = amount;
  } else if (accountName === "Clinical Tool Licensure") {
    powerbiKpi["Operating Expenses"]["Clinical Tool Licensure"] = amount;
  } else if (accountName === "Equipment Maint. & Repair") {
    powerbiKpi["Operating Expenses"]["Equipment Maint. & Repair"] = amount;
  } else if (accountName === "Legal & Accounting") {
    powerbiKpi["Operating Expenses"]["Legal & Accounting"] = amount;
  } else if (accountName === "Medical Supplies") {
    powerbiKpi["Operating Expenses"]["Medical Supplies"] = amount;
  } else if (accountName === "Patient Notification Tools") {
    powerbiKpi["Operating Expenses"]["Patient Notification Tools"] = amount;
  } else if (accountName === "Office Expenses") {
    powerbiKpi["Operating Expenses"]["Office Expenses"] = amount;
  } else if (accountName === "Practice Mgmt Software Lease") {
    powerbiKpi["Operating Expenses"]["Practice Mgmt Software Lease"] = amount;
  } else if (accountName === "Rent") {
    powerbiKpi["Operating Expenses"]["Rent"] = amount;
  } else if (accountName === "Telephone Office") {
    powerbiKpi["Operating Expenses"]["Telephone Office"] = amount;
  } else if (accountName === "Utilities") {
    powerbiKpi["Operating Expenses"]["Utilities"] = amount;
  } else if (accountName === "Vaccines") {
    powerbiKpi["Operating Expenses"]["Vaccines"] = amount;
  } else if (accountName === "Website Expense") {
    powerbiKpi["Operating Expenses"]["Website Expense"] = amount;
  } else if (accountName === "Workmans Comp Ins") {
    powerbiKpi["Operating Expenses"]["Workmans Comp Ins"] = amount;
  }

  // Admin expenses mapping
  else if (accountName === "Doctor Admin Income Expense - Canner") {
    powerbiKpi["Admin"]["Doctor Admin Income Expense - Canner"] = amount;
  } else if (accountName === "Doctor Admin Income Expense - Ghosh") {
    powerbiKpi["Admin"]["Doctor Admin Income Expense - Ghosh"] = amount;
  } else if (accountName === "Doctor Admin Income Expense - Pierce") {
    powerbiKpi["Admin"]["Doctor Admin Income Expense - Pierce"] = amount;
  } else if (accountName === "Doctor Admin Income Expense - Scherer") {
    powerbiKpi["Admin"]["Doctor Admin Income Expense - Scherer"] = amount;
  } else if (accountName === "Doctor Admin Income Expense - Shah") {
    powerbiKpi["Admin"]["Doctor Admin Income Expense - Shah"] = amount;
  }

  // Dues, Subscriptions & License mapping
  else if (accountName === "Dues, Sub & Lic Deb Ghosh") {
    powerbiKpi["Dues, Subscriptions & License"]["Dues, Sub & Lic Deb Ghosh"] =
      amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. Canner") {
    powerbiKpi["Dues, Subscriptions & License"][
      "Dues, Subs & Lic - Dr. Canner"
    ] = amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. George") {
    powerbiKpi["Dues, Subscriptions & License"][
      "Dues, Subs & Lic - Dr. George"
    ] = amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. Pierce") {
    powerbiKpi["Dues, Subscriptions & License"][
      "Dues, Subs & Lic - Dr. Pierce"
    ] = amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. Scherer") {
    powerbiKpi["Dues, Subscriptions & License"][
      "Dues, Subs & Lic - Dr. Scherer"
    ] = amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. Shah") {
    powerbiKpi["Dues, Subscriptions & License"]["Dues, Subs & Lic - Dr. Shah"] =
      amount;
  } else if (accountName === "Dues, Subs & Lic - Dr. Shaikh") {
    powerbiKpi["Dues, Subscriptions & License"][
      "Dues, Subs & Lic - Dr. Shaikh"
    ] = amount;
  }

  // Payroll Tax Expense mapping
  else if (accountName === "Payroll Tax - Associate Dr. Shaikh") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Associate Dr. Shaikh"
    ] = amount;
  } else if (accountName === "Payroll Tax - Dr. Canner") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Dr. Canner"
    ] = amount;
  } else if (accountName === "Payroll Tax - Dr. Ghosh") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Dr. Ghosh"
    ] = amount;
  } else if (accountName === "Payroll Tax - Dr. Pierce") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Dr. Pierce"
    ] = amount;
  } else if (accountName === "Payroll Tax - Dr. Scherer") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Dr. Scherer"
    ] = amount;
  } else if (accountName === "Payroll Tax - Dr. Shah") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Dr. Shah"
    ] = amount;
  } else if (accountName === "Payroll Tax - Office Staff") {
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"][
      "Payroll Tax - Office Staff"
    ] = amount;
  }

  // Salary Expense mapping
  else if (accountName === "Payroll - Office Staff") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"][
      "Payroll - Office Staff"
    ] = amount;
  } else if (accountName === "Salary - Associate Dr. Shaikh") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"][
      "Salary - Associate Dr. Shaikh"
    ] = amount;
  } else if (accountName === "Salary - Dr. Canner") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"]["Salary - Dr. Canner"] =
      amount;
  } else if (accountName === "Salary - Dr. Ghosh") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"]["Salary - Dr. Ghosh"] =
      amount;
  } else if (accountName === "Salary - Dr. Pierce") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"]["Salary - Dr. Pierce"] =
      amount;
  } else if (accountName === "Salary - Dr. Scherer") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"][
      "Salary - Dr. Scherer"
    ] = amount;
  } else if (accountName === "Salary - Dr. Shah") {
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"]["Salary - Dr. Shah"] =
      amount;
  }

  // Other Expenses mapping
  else if (accountName === "Bank Charge") {
    powerbiKpi["Other Expenses"]["Bank Charge"] = amount;
  } else if (accountName === "Meals & Entertainment") {
    powerbiKpi["Other Expenses"]["Meals & Entertainment"] = amount;
  } else if (accountName === "Profit Sharing") {
    powerbiKpi["Other Expenses"]["Profit Sharing"] = amount;
  } else if (accountName === "Refunds") {
    powerbiKpi["Other Expenses"]["Refunds"] = amount;
  } else if (accountName === "Reimbursement") {
    powerbiKpi["Other Expenses"]["Reimbursement"] = amount;
  } else if (accountName === "Service fee") {
    powerbiKpi["Other Expenses"]["Service fee"] = amount;
  } else if (accountName === "Interest Expense") {
    powerbiKpi["Other Expenses"]["Interest Expense"] = amount;
  }

  // Health Insurance Expense mapping
  else if (accountName === "Health Insurance - B. Scherer") {
    powerbiKpi["Health Insurance Expense (Medical)"][
      "Health Insurance - B. Scherer"
    ] = amount;
  } else if (accountName === "Health Insurance - Employee") {
    powerbiKpi["Health Insurance Expense (Medical)"][
      "Health Insurance - Employee"
    ] = amount;
  } else if (accountName === "Health Insurance - J. Canner") {
    powerbiKpi["Health Insurance Expense (Medical)"][
      "Health Insurance - J. Canner"
    ] = amount;
  }
}

function calculateCategoryTotals(powerbiKpi) {
  // Calculate Operating Expenses total
  let operatingTotal = 0;
  for (const [key, value] of Object.entries(powerbiKpi["Operating Expenses"])) {
    if (key !== "Total Operating Expense" && value !== null) {
      operatingTotal += value;
    }
  }
  powerbiKpi["Operating Expenses"]["Total Operating Expense"] =
    operatingTotal || null;

  // Calculate Admin total
  let adminTotal = 0;
  for (const [key, value] of Object.entries(powerbiKpi["Admin"])) {
    if (key !== "Total Admin Expense" && value !== null) {
      adminTotal += value;
    }
  }
  powerbiKpi["Admin"]["Total Admin Expense"] = adminTotal || null;

  // Calculate Dues, Subscriptions & License total
  let duesTotal = 0;
  for (const [key, value] of Object.entries(
    powerbiKpi["Dues, Subscriptions & License"]
  )) {
    if (key !== "Total Dues, Subs & Lic" && value !== null) {
      duesTotal += value;
    }
  }
  powerbiKpi["Dues, Subscriptions & License"]["Total Dues, Subs & Lic"] =
    duesTotal || null;

  // Calculate Payroll Tax total
  let payrollTaxTotal = 0;
  for (const [key, value] of Object.entries(
    powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"]
  )) {
    if (key !== "Total Payroll Tax" && value !== null) {
      payrollTaxTotal += value;
    }
  }
  powerbiKpi["Payroll Tax Expense"]["Payroll Expenses"]["Total Payroll Tax"] =
    payrollTaxTotal || null;

  // Calculate Salary total
  let salaryTotal = 0;
  for (const [key, value] of Object.entries(
    powerbiKpi["Payroll Tax Expense"]["Salary Expense"]
  )) {
    if (key !== "Total Salary" && value !== null) {
      salaryTotal += value;
    }
  }
  powerbiKpi["Payroll Tax Expense"]["Salary Expense"]["Total Salary"] =
    salaryTotal || null;

  // Calculate Other Expenses total
  let otherTotal = 0;
  for (const [key, value] of Object.entries(powerbiKpi["Other Expenses"])) {
    if (key !== "Total Other expense" && value !== null) {
      otherTotal += value;
    }
  }
  powerbiKpi["Other Expenses"]["Total Other expense"] = otherTotal || null;

  // Calculate Health Insurance total
  let healthTotal = 0;
  for (const [key, value] of Object.entries(
    powerbiKpi["Health Insurance Expense (Medical)"]
  )) {
    if (key !== "Total Medical Expense" && value !== null) {
      healthTotal += value;
    }
  }
  powerbiKpi["Health Insurance Expense (Medical)"]["Total Medical Expense"] =
    healthTotal || null;
}

async function insertReportHeader(pnl, powerbiKpiJson, realmId) {
  const h = pnl.Header || {};
  const reportData = {
    report_name: h.ReportName || null,
    report_basis: h.ReportBasis || null,
    start_date: h.StartPeriod || null,
    end_date: h.EndPeriod || null,
    currency: h.Currency || null,
    generated_at: h.Time ? new Date(h.Time) : new Date(),
    raw: pnl,
    powerbi_kpi_json: powerbiKpiJson,
    realm_id: realmId,
  };

  const report = await PnLReport.create(reportData);
  return report.id;
}

async function insertLines(reportId, rows, accountMap, realmId) {
  if (!rows.length) return;
  
  // Map account_id -> account_name; fallback to account_label
  const prepared = rows.map((r) => {
    const accountName =
      r.account_id && accountMap.get(r.account_id)
        ? accountMap.get(r.account_id)
        : r.account_label;

    return {
      report_id: reportId,
      path: r.path,
      account_name: accountName,
      account_id: r.account_id,
      amount: r.amount,
      category: getCategoryForAccount(accountName),
      realm_id: realmId,
    };
  });

  await PnLLine.bulkCreate(prepared, {
    validate: false,
    ignoreDuplicates: true,
  });
}

async function insertSummaries(reportId, summaries, realmId) {
  if (!summaries.length) return;
  
  const prepared = summaries.map((s) => ({
    report_id: reportId,
    group: s.group,
    label: s.label,
    path: s.path,
    amount: s.amount,
    realm_id: realmId,
  }));

  await PnLSummary.bulkCreate(prepared, {
    validate: false,
    ignoreDuplicates: true,
  });
}

export async function processPnLData(pnl, realmId) {
  try {
    logger.info('Processing P&L data', { realmId });

    // 1) Flatten
    const { flat, summaries } = flattenPnL(pnl);
    logger.info('P&L data flattened', { 
      flatCount: flat.length, 
      summariesCount: summaries.length 
    });

    // 2) Load Accounts map from DB, map account_id -> name
    const accountMap = await loadAccountMap();
    logger.info('Account map loaded', { count: accountMap.size });

    // 3) Transform to PowerBI KPI format
    const powerbiKpiJson = transformToPowerBIKPI(flat, accountMap);
    logger.info('PowerBI KPI JSON generated');

    // 4) Insert header row (report) with PowerBI KPI JSON and get report_id
    const reportId = await insertReportHeader(pnl, powerbiKpiJson, realmId);
    logger.info('P&L report header inserted', { reportId });

    // 5) Insert detail lines and summaries
    await insertLines(reportId, flat, accountMap, realmId);
    await insertSummaries(reportId, summaries, realmId);
    logger.info('P&L line items and summaries inserted', { 
      linesCount: flat.length, 
      summariesCount: summaries.length 
    });

    // 6) Calculate totals for response
    const totIncome = flat
      .filter((r) => (r.path || "").startsWith("Income"))
      .reduce((a, r) => a + (Number.isFinite(r.amount) ? r.amount : 0), 0);
    const totExpenses = flat
      .filter((r) => (r.path || "").startsWith("Expenses"))
      .reduce((a, r) => a + (Number.isFinite(r.amount) ? r.amount : 0), 0);
    const calcNet = totIncome - totExpenses;
    const reportedNet =
      summaries.find((s) => s.group === "NetIncome")?.amount ?? null;

    return {
      reportId,
      totals: {
        totalIncome: totIncome,
        totalExpenses: totExpenses,
        netIncome: calcNet,
        reportedNetIncome: reportedNet,
      },
      balanceCheck: {
        calculated: calcNet,
        reported: reportedNet,
        balanced: Math.abs(calcNet - (reportedNet || 0)) < 0.01,
      },
      powerbiKpi: powerbiKpiJson,
    };
  } catch (error) {
    logger.error('Failed to process P&L data', { error: error.message, realmId });
    throw error;
  }
}

export async function getPnLReportsByRealmId(realmId, options = {}) {
  try {
    const reports = await PnLReport.findAll({
      where: { realm_id: realmId },
      include: [
        {
          model: PnLLine,
          as: 'lines',
        },
        {
          model: PnLSummary,
          as: 'summaries',
        },
      ],
      order: [['created_at', 'DESC']],
      ...options,
    });

    return reports;
  } catch (error) {
    logger.error('Failed to get P&L reports by realm ID', { 
      error: error.message, 
      realmId 
    });
    throw error;
  }
}

export {
  flattenPnL,
  transformToPowerBIKPI,
  getCategoryForAccount,
  parseAmount,
};
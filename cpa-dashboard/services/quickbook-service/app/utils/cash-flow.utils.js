import { CashFlowReport, CashFlowLine, CashFlowTotal } from '../models/index.js';
import logger from '../../config/logger.config.js';

function parseAmount(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

// Map QBO groups/sections to our normalized buckets
function normalizeGroup(rawGroup, headerLabel) {
  const g = String(rawGroup || "").toLowerCase();
  const h = String(headerLabel || "").toLowerCase();

  if (g.includes("operating") || h.includes("operating")) return "Operating";
  if (g.includes("investing") || h.includes("investing")) return "Investing";
  if (g.includes("financing") || h.includes("financing")) return "Financing";
  if (
    g.includes("cashincrease") ||
    h.includes("net cash increase") ||
    h.includes("net cash decrease") ||
    h.includes("net cash")
  )
    return "NetCash";
  if (g.includes("beginningcash") || h.includes("cash at beginning"))
    return "BeginningCash";
  if (g.includes("endingcash") || h.includes("cash at end"))
    return "EndingCash";
  return null;
}

/**
 * Flatten QuickBooks Cash Flow data into a structured format
 * @param {Object} cashFlowData - Raw QuickBooks Cash Flow data
 * @returns {Object} Flattened data with header and lines
 */
export function flattenCashFlow(cashFlowData) {
  const flat = [];
  const header = cashFlowData?.Header || {};
  const rowsNode = cashFlowData?.Rows || {};

  function walk(node, path = [], currentGroup = null) {
    const rows = node?.Row || [];
    for (const r of rows) {
      const t = r.type;
      let newPath = path.slice();
      let group = currentGroup;

      // Header section updates path + maybe group
      const headerLabel = r.Header?.ColData?.[0]?.value || "";
      if (headerLabel) {
        newPath.push(headerLabel);
        const normalized = normalizeGroup(r.group, headerLabel);
        if (normalized) group = normalized;
      }

      if (t === "Data") {
        const cd = r.ColData || [];
        flat.push({
          path: newPath.join(" > "),
          label: cd[0]?.value || "",
          group: normalizeGroup(r.group, cd[0]?.value) || group,
          amount: parseAmount(cd[1]?.value),
        });
      }

      if (t === "Section" && r.Summary?.ColData?.length >= 2) {
        const s = r.Summary.ColData;
        flat.push({
          path: newPath.join(" > "),
          label: s[0]?.value || "",
          group: normalizeGroup(r.group, s[0]?.value) || group,
          amount: parseAmount(s[1]?.value),
        });
      }

      if (r.Rows) walk(r.Rows, newPath, group);

      // Section without Header (some summaries come as Section only)
      if (t === "Section" && !r.Header && r.Summary?.ColData?.length >= 2) {
        const s = r.Summary.ColData;
        flat.push({
          path: newPath.join(" > "),
          label: s[0]?.value || "",
          group: normalizeGroup(r.group, s[0]?.value) || group,
          amount: parseAmount(s[1]?.value),
        });
      }
    }
  }

  walk(rowsNode, [], null);
  return { header, lines: flat };
}

/**
 * Transform flattened cash flow data into PowerBI KPI format
 * @param {Array} lines - Flattened cash flow lines
 * @returns {Object} PowerBI KPI JSON structure
 */
export function transformToPowerBIKPI(lines) {
  const kpi = {
    report_type: "CashFlow",
    generated_at: new Date().toISOString(),
    activities: {
      operating: {},
      investing: {},
      financing: {},
    },
    totals: {
      operating: 0,
      investing: 0,
      financing: 0,
      net_cash_flow: 0,
      beginning_cash: 0,
      ending_cash: 0,
    },
  };

  for (const line of lines) {
    const group = line.group?.toLowerCase() || "";
    const amount = line.amount || 0;

    if (group === "operating") {
      kpi.activities.operating[line.label] = amount;
      kpi.totals.operating += amount;
    } else if (group === "investing") {
      kpi.activities.investing[line.label] = amount;
      kpi.totals.investing += amount;
    } else if (group === "financing") {
      kpi.activities.financing[line.label] = amount;
      kpi.totals.financing += amount;
    } else if (group === "netcash") {
      kpi.totals.net_cash_flow = amount;
    } else if (group === "beginningcash") {
      kpi.totals.beginning_cash = amount;
    } else if (group === "endingcash") {
      kpi.totals.ending_cash = amount;
    }
  }

  return kpi;
}

/**
 * Insert cash flow report header
 * @param {Object} cashFlowData - Raw QuickBooks data
 * @param {Object} powerbiKpiJson - PowerBI KPI JSON
 * @param {string} realmId - Realm ID
 * @returns {number} Report ID
 */
export async function insertReportHeader(cashFlowData, powerbiKpiJson, realmId) {
  try {
    const header = cashFlowData?.Header || {};
    const reportData = {
      report_name: header.ReportName || "CashFlow",
      report_basis: header.ReportBasis || "Cash",
      start_date: header.StartPeriod || null,
      end_date: header.EndPeriod || null,
      currency: header.Currency || "USD",
      generated_at: header.Time ? new Date(header.Time) : new Date(),
      raw: cashFlowData,
      powerbi_kpi_json: powerbiKpiJson,
      realm_id: realmId,
    };

    const report = await CashFlowReport.create(reportData);
    logger.info('Cash flow report header inserted', {
      reportId: report.id,
      realmId,
    });
    return report.id;
  } catch (error) {
    logger.error('Failed to insert cash flow report header', {
      error: error.message,
      realmId,
    });
    throw error;
  }
}

/**
 * Insert cash flow lines
 * @param {number} reportId - Report ID
 * @param {Array} lines - Flattened lines
 * @param {string} realmId - Realm ID
 */
export async function insertLines(reportId, lines, realmId) {
  try {
    if (!lines.length) return;

    const prepared = lines.map((line) => ({
      report_id: reportId,
      path: line.path,
      label: line.label,
      group: line.group,
      amount: line.amount,
      realm_id: realmId,
    }));

    await CashFlowLine.bulkCreate(prepared, {
      validate: false,
      ignoreDuplicates: true,
    });

    logger.info('Cash flow lines inserted', {
      reportId,
      linesCount: prepared.length,
      realmId,
    });
  } catch (error) {
    logger.error('Failed to insert cash flow lines', {
      error: error.message,
      reportId,
      realmId,
    });
    throw error;
  }
}

/**
 * Insert cash flow totals
 * @param {number} reportId - Report ID
 * @param {Array} lines - Flattened lines
 * @param {string} realmId - Realm ID
 */
export async function insertTotals(reportId, lines, realmId) {
  try {
    // Calculate totals from lines
    const totals = {
      operating: 0,
      investing: 0,
      financing: 0,
      net_cash_flow: 0,
      beginning_cash: 0,
      ending_cash: 0,
    };

    for (const line of lines) {
      const group = line.group?.toLowerCase() || "";
      const amount = line.amount || 0;

      if (group === "operating") {
        totals.operating += amount;
      } else if (group === "investing") {
        totals.investing += amount;
      } else if (group === "financing") {
        totals.financing += amount;
      } else if (group === "netcash") {
        totals.net_cash_flow = amount;
      } else if (group === "beginningcash") {
        totals.beginning_cash = amount;
      } else if (group === "endingcash") {
        totals.ending_cash = amount;
      }
    }

    const totalData = {
      report_id: reportId,
      operating: totals.operating,
      investing: totals.investing,
      financing: totals.financing,
      net_cash_flow: totals.net_cash_flow,
      beginning_cash: totals.beginning_cash,
      ending_cash: totals.ending_cash,
      realm_id: realmId,
    };

    await CashFlowTotal.create(totalData);
    logger.info('Cash flow totals inserted', {
      reportId,
      totals,
      realmId,
    });
  } catch (error) {
    logger.error('Failed to insert cash flow totals', {
      error: error.message,
      reportId,
      realmId,
    });
    throw error;
  }
}

/**
 * Process cash flow data and save to database
 * @param {Object} cashFlowData - Raw QuickBooks data
 * @param {string} realmId - Realm ID
 * @returns {Object} Processing result
 */
export async function processCashFlowData(cashFlowData, realmId) {
  try {
    logger.info('Processing cash flow data', { realmId });

    // Flatten the data
    const { header, lines } = flattenCashFlow(cashFlowData);
    logger.info('Cash flow data flattened', {
      linesCount: lines.length,
      realmId,
    });

    // Transform to PowerBI KPI format
    const powerbiKpiJson = transformToPowerBIKPI(lines);
    logger.info('PowerBI KPI JSON generated', { realmId });

    // Insert report header
    const reportId = await insertReportHeader(cashFlowData, powerbiKpiJson, realmId);

    // Insert lines
    await insertLines(reportId, lines, realmId);

    // Insert totals
    await insertTotals(reportId, lines, realmId);

    // Calculate summary totals
    const totals = {
      operating: 0,
      investing: 0,
      financing: 0,
      net_cash_flow: 0,
      beginning_cash: 0,
      ending_cash: 0,
    };

    for (const line of lines) {
      const group = line.group?.toLowerCase() || "";
      const amount = line.amount || 0;

      if (group === "operating") {
        totals.operating += amount;
      } else if (group === "investing") {
        totals.investing += amount;
      } else if (group === "financing") {
        totals.financing += amount;
      } else if (group === "netcash") {
        totals.net_cash_flow = amount;
      } else if (group === "beginningcash") {
        totals.beginning_cash = amount;
      } else if (group === "endingcash") {
        totals.ending_cash = amount;
      }
    }

    logger.info('Cash flow data processed successfully', {
      reportId,
      linesCount: lines.length,
      totals,
      realmId,
    });

    return {
      reportId,
      linesCount: lines.length,
      totals,
      powerbiKpiJson,
    };
  } catch (error) {
    logger.error('Failed to process cash flow data', {
      error: error.message,
      realmId,
    });
    throw error;
  }
}

/**
 * Get cash flow reports by realm ID
 * @param {string} realmId - Realm ID
 * @param {Object} options - Query options
 * @returns {Array} Cash flow reports
 */
export async function getCashFlowReportsByRealmId(realmId, options = {}) {
  try {
    const reports = await CashFlowReport.findAll({
      where: { realm_id: realmId },
      include: [
        {
          model: CashFlowLine,
          as: 'lines',
        },
        {
          model: CashFlowTotal,
          as: 'totals',
        },
      ],
      order: [['created_at', 'DESC']],
      ...options,
    });

    logger.info('Cash flow reports retrieved', {
      realmId,
      count: reports.length,
    });

    return reports;
  } catch (error) {
    logger.error('Failed to get cash flow reports', {
      error: error.message,
      realmId,
    });
    throw error;
  }
}

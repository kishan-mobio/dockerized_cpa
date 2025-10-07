import { HARDCODED_STRINGS } from '../app/utils/constants/strings.constants.js';
import { QUICKBOOKS_REPORTS_MESSAGES } from '../app/utils/constants/error.constants.js';
import reportsService from '../app/services/reports.service.js';

/**
 * Report configuration mapping
 * Centralized configuration for all report types
 */
export const REPORT_CONFIG = {
  TrialBalance: {
    mapFunction: reportsService.mapTrialBalanceToOptimizedStructure,
    saveFunction: reportsService.saveTrialBalanceData,
    successMessage: QUICKBOOKS_REPORTS_MESSAGES.REPORTS.TRIAL_BALANCE_SUCCESS,
    requiresDates: true,
    reportType: HARDCODED_STRINGS.REPORT_TYPES.TRIAL_BALANCE,
  },
  ProfitAndLoss: {
    mapFunction: reportsService.mapProfitLossToOptimizedStructure,
    saveFunction: reportsService.saveProfitLossData,
    successMessage: QUICKBOOKS_REPORTS_MESSAGES.REPORTS.PROFIT_LOSS_SUCCESS,
    requiresDates: false, // Can auto-generate dates
    reportType: HARDCODED_STRINGS.REPORT_TYPES.PROFIT_AND_LOSS,
    isAsync: true, // Mark as async since mapping function is now async
  },
  BalanceSheet: {
    mapFunction: reportsService.mapBalanceSheetToOptimizedStructure,
    saveFunction: reportsService.saveBalanceSheetData,
    successMessage: QUICKBOOKS_REPORTS_MESSAGES.REPORTS.BALANCE_SHEET_SUCCESS,
    requiresDates: true,
    reportType: HARDCODED_STRINGS.REPORT_TYPES.BALANCE_SHEET,
    isAsync: true, // Mark as async since mapping function is now async
  },
  CashFlow: {
    mapFunction: reportsService.mapCashFlowToOptimizedStructure,
    saveFunction: reportsService.saveCashFlowData,
    successMessage: QUICKBOOKS_REPORTS_MESSAGES.REPORTS.CASH_FLOW_SUCCESS,
    requiresDates: true,
    reportType: HARDCODED_STRINGS.REPORT_TYPES.CASH_FLOW,
    isAsync: true, // Mark as async since mapping function is now async
  },
};

/**
 * Get report configuration by type
 * @param {string} reportType - Report type
 * @returns {Object} Report configuration
 */
export const getReportConfig = (reportType) => {
  return REPORT_CONFIG[reportType] || null;
};


export default {
  REPORT_CONFIG,
  getReportConfig
};

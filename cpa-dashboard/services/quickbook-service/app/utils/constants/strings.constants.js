
export const HARDCODED_STRINGS = {
  MISSING_ENV_VARS: 'Missing environment variables',
  ORGANIZATION_ID_AND_ACCOUNT_ID_REQUIRED: 'Organization ID and Account ID are required',
  UNKNOWN_USER: 'unknown',
  CODE: 'code',
  
  REPORT_TYPES: {
    TRIAL_BALANCE: 'TrialBalance',
    PROFIT_AND_LOSS: 'ProfitAndLoss',
    BALANCE_SHEET: 'BalanceSheet',
    CASH_FLOW: 'CashFlow',
    TRIAL_BALANCE_DISPLAY: 'Trial Balance',
    PROFIT_LOSS_DISPLAY: 'Profit & Loss',
    BALANCE_SHEET_DISPLAY: 'Balance Sheet',
    CASH_FLOW_DISPLAY: 'Cash Flow'
  },
  
  BOOLEAN: {
    TRUE: 'true',
    FALSE: 'false'
  },
  
  DB_ORDER: {
    CREATED_AT_DESC: [['created_at', 'DESC']]
  },
  
  REPORT_DEFAULTS: {
    COL_TYPE: 'Money',
    REPORT_NAME_TRIAL_BALANCE: 'TrialBalance',
    REPORT_NAME_PROFIT_LOSS: 'ProfitAndLoss',
    REPORT_NAME_BALANCE_SHEET: 'BalanceSheet',
    REPORT_NAME_CASH_FLOW: 'CashFlow',
    REPORT_BASIS: 'Accrual',
    SUMMARIZE_COLUMNS_BY: 'Month',
    CURRENCY: 'USD',
    ROW_TYPE_DATA: 'Data',
    PERIOD_DATES: 'Period dates',
    FAILED_TO_REFRESH_TOKEN: 'Failed to refresh token',
    DEFAULT_COLUMN_TITLE: 'Current Period',
    DEFAULT_COLUMN_TYPE: 'Data'
  }
};


export default HARDCODED_STRINGS;

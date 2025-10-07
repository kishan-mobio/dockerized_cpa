import { HARDCODED_STRINGS } from './strings.constants.js';

export const REPORT_CONSTANTS = {
  // Default column values
  DEFAULT_COLUMN: {
    TITLE: HARDCODED_STRINGS.REPORT_DEFAULTS.DEFAULT_COLUMN_TITLE,
    TYPE: HARDCODED_STRINGS.REPORT_DEFAULTS.DEFAULT_COLUMN_TYPE,
    ORDER: 0,
  },

  // Batch processing
  BATCH_SIZE: 100,

  // Cash Flow Activity Types
  CASH_FLOW_ACTIVITY_TYPES: {
    OPERATING: 'Operating',
    INVESTING: 'Investing',
    FINANCING: 'Financing',
    CASH: 'Cash',
  },

  // Date validation
  DATE_VALIDATION: {
    MAX_DAYS_IN_YEAR: 3650, // Allow up to 10 years for longer historical data
  },

  // Database field defaults
  DATABASE_DEFAULTS: {
    REALM_ID: 'default_realm',
  },

  // Report column types
  COLUMN_TYPES: {
    DATA: HARDCODED_STRINGS.REPORT_DEFAULTS.ROW_TYPE_DATA,
    MONEY: HARDCODED_STRINGS.REPORT_DEFAULTS.COL_TYPE,
    HEADER: 'Header',
  },

  // Report basis types
  REPORT_BASIS: {
    ACCRUAL: HARDCODED_STRINGS.REPORT_DEFAULTS.REPORT_BASIS,
    CASH: 'Cash',
  },

  // Summarize columns by
  SUMMARIZE_COLUMNS_BY: {
    MONTH: HARDCODED_STRINGS.REPORT_DEFAULTS.SUMMARIZE_COLUMNS_BY,
    QUARTER: 'Quarter',
    YEAR: 'Year',
  },

  // Currency defaults
  CURRENCY: {
    USD: HARDCODED_STRINGS.REPORT_DEFAULTS.CURRENCY,
  },
};

export default REPORT_CONSTANTS;

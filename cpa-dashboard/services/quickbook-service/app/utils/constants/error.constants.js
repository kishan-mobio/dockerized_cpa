export const ERROR_MESSAGES = {
  DATABASE_CONNECTION_CLOSE_SUCCESS: "Database connection closed successfully",
  DATABASE_CONNECTION_CLOSE_ERROR: "Database connection close error",
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  DATABASE_SAVE_FAILED: "Failed to save data to database",
  DATABASE_RETRIEVAL_FAILED: "Failed to retrieve data from database",
  GENERAL: "An error occurred",
  INTERNAL_SERVER_ERROR: "Internal server error",

  VALIDATION: {
    REQUIRED_FIELD: (field) => `${field} is required`,
    REQUIRED_FIELDS: (fields) => `Required fields: ${fields}`,
    INVALID_FORMAT: (field) => `Invalid format for ${field}`,
    INVALID_VALUE: (field) => `Invalid value for ${field}`,
    FIELD_TOO_LONG: (field) => `${field} is too long`,
    FIELD_TOO_SHORT: (field) => `${field} is too short`,
  },

  PROCESSING: {
    DATA_MAPPING_FAILED: "Data mapping failed",
    PROCESSING_FAILED: (operation) => `Failed to process ${operation}`,
  },

  GENERIC: {
    PROCESSING_FAILED: (operation) => `Failed to process ${operation}`,
    INTERNAL_SERVER_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    BAD_REQUEST: "Bad request",
  },
};

export const DATE_ERROR_MESSAGES = {
  INVALID_DATE: "Invalid date provided",
  INVALID_DATE_PROVIDED: "Invalid date provided",
  INVALID_START_DATE: "Invalid start date",
  INVALID_END_DATE: "Invalid end date",
  INVALID_BIRTH_DATE: "Invalid birth date",
  START_DATE_AFTER_END_DATE: "Start date cannot be after end date",
};

export const ENCRYPTION_ERROR_MESSAGES = {
  ENCRYPTION_FAILED: "Encryption failed",
  DECRYPTION_FAILED: "Decryption failed",
};

export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const QUICKBOOKS_ERROR_MESSAGES = {
  ORIGIN_NOT_ALLOWED: "Not allowed by CORS",
  CORS_POLICY_VIOLATION: "CORS policy violation",
  INTERNAL_SERVER_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  TOKEN_REQUIRED: "Access token is required",
  USER_NOT_FOUND: "User not found",
  TOKEN_REVOKED: "Token has been revoked",
  UNAUTHORIZED: "Unauthorized access",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  ACCOUNT_NOT_FOUND: "QuickBooks account not found",
  TOKENS_REQUIRED: "Access token and refresh token are required",
  ACCOUNT_ID_REQUIRED: "Account ID is required",
  AUTHORIZATION_CODE_NOT_FOUND: "Authorization code not found",
  ORGANIZATION_ID_REQUIRED: "Organization ID is required",
  QUICKBOOKS_ACCOUNT_ALREADY_EXISTS:
    "QuickBooks account already exists for this organization",
  ACCOUNT_AUTHORIZED: "QuickBooks account authorized successfully",
  ACCOUNTS_FETCHED_SUCCESSFULLY: "QuickBooks accounts fetched successfully",
  TOKEN_ADDED_SUCCESSFULLY: "Token added successfully",
  NEW_TOKEN_GENERATED: "New token generated successfully",
  DATA_SYNCED_SUCCESSFULLY: "Data synced successfully",
  ACCOUNT_ENABLED_SUCCESSFULLY: "Account enabled successfully",
  ACCOUNT_DISABLED_SUCCESSFULLY: "Account disabled successfully",
  NO_DATA_FOUND: "No data found",
  FAILED_TO_REFRESH_TOKENS: "Failed to refresh tokens",
  FOREIGN_KEY_VIOLATION_ERROR: "Foreign key constraint violation",
  DUPLICATE_QUICKBOOK_ACCOUNT_ERROR: "QuickBooks account already exists",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

export const QUICKBOOKS_HEALTH_MESSAGES = {
  SERVICE_HEALTHY: "QuickBooks service is healthy",
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  HEALTH_CHECK_FAILED: "QuickBooks service health check failed",
};


export const QUICKBOOKS_COMMON_MESSAGES = {
  ERROR_DESTROYING_CONNECTION: "Error destroying connection",
  ERROR_DESTROYING_OLD_CONNECTION: "Error destroying old connection",
  DATA_MUST_BE_ARRAY: "Data must be an array",
  DATABASE_CONNECTION_NOT_ESTABLISHED: "Database connection not established",
  FAILED_TO_REFRESH_ACCESS_TOKEN: "Failed to refresh access token",
  QUICKBOOKS_SYNC_MAIN_ERROR: "QuickBooks sync main error",
  FAILED_TO_REFRESH_TOKEN: "Failed to refresh token",
  ORGANIZATION_MODEL_NOT_AVAILABLE: "Organization model not available",
};

export const QUICKBOOKS_MESSAGES = {
  ACCOUNT_AUTHORIZED: 'QuickBooks account authorized successfully',
  ACCOUNTS_FETCHED_SUCCESSFULLY: 'QuickBooks accounts fetched successfully',
  TOKEN_ADDED_SUCCESSFULLY: 'Token added successfully',
  NEW_TOKEN_GENERATED: 'New token generated successfully',
  DATA_SYNCED_SUCCESSFULLY: 'Data synced successfully',
  ACCOUNT_ENABLED_SUCCESSFULLY: 'Account enabled successfully',
  ACCOUNT_DISABLED_SUCCESSFULLY: 'Account disabled successfully',
  NO_DATA_FOUND: 'No data found',
  FAILED_TO_REFRESH_TOKENS: 'Failed to refresh tokens',
  FOREIGN_KEY_VIOLATION_ERROR: 'Foreign key constraint violation',
  DUPLICATE_QUICKBOOK_ACCOUNT_ERROR: 'QuickBooks account already exists',
  ACCOUNT_NOT_FOUND: 'QuickBooks account not found',
  TOKENS_REQUIRED: 'Access token and refresh token are required',
  ACCOUNT_ID_REQUIRED: 'Account ID is required',
  AUTHORIZATION_CODE_NOT_FOUND: 'Authorization code not found',
  ORGANIZATION_ID_REQUIRED: 'Organization ID is required',
  QUICKBOOKS_ACCOUNT_ALREADY_EXISTS: 'QuickBooks account already exists for this organization',
  INVALID_TOKEN_RESPONSE_FROM_QUICKBOOKS: 'Invalid token response from QuickBooks',
};

export const QUICKBOOKS_REPORTS_MESSAGES = {
  AUTH: {
    TOKEN_EXPIRED: 'Token has expired',
    ACCESS_DENIED: 'Access denied',
  },
  REPORTS: {
    COMPANY_NOT_FOUND: 'Company not found',
    TRIAL_BALANCE_SUCCESS: 'Trial balance report generated successfully',
    PROFIT_LOSS_SUCCESS: 'Profit & loss report generated successfully',
    BALANCE_SHEET_SUCCESS: 'Balance sheet report generated successfully',
    CASH_FLOW_SUCCESS: 'Cash flow report generated successfully',
    NO_DATA_FOUND: 'No data found for the specified period',
  },
};

export const QUICKBOOKS_VALIDATION_ERROR_MESSAGES = {
  DEFAULT_SOURCE: "body",
  JOIN_SEPARATOR: ".",
  QUOTE_REPLACEMENT: "",
  USER_AGENT_HEADER: "User-Agent",
  DEVELOPMENT_MODE: "development",
  VALIDATION_ERROR_TYPE: "validation_error",

  VALIDATION_FAILED: "Validation failed",
  VALIDATION_FAILED_FOR_SOURCE: (source) => `Validation failed for ${source}`,
  VALIDATION_PROCESSING_ERROR: "Validation processing error",
  DATA_SANITIZATION_ERROR: "Data sanitization error",

  EXPRESS_VALIDATION_FAILED: "Express validation failed",
  EXPRESS_VALIDATION_ERROR: "Express validation error",
  JOI_VALIDATION_FAILED: "Joi validation failed",
  JOI_VALIDATION_MIDDLEWARE_ERROR: "Joi validation middleware error",
  MULTI_SOURCE_VALIDATION_FAILED: "Multi-source validation failed",
  MULTI_SOURCE_VALIDATION_ERROR: "Multi-source validation error",
  ASYNC_VALIDATION_ERROR: "Async validation error",
  SANITIZATION_ERROR: "Sanitization error",

  VALIDATION: {
    REQUIRED_FIELD: (field) => `${field} is required`,
    REQUIRED_FIELDS: (fields) => `${fields} are required`,
  },
  GENERIC: {
    PROCESSING_FAILED: (operation) => `${operation} failed`,
  },
  DATABASE: {
    SAVE_FAILED: "Failed to save data",
    RETRIEVAL_FAILED: "Failed to retrieve data",
  },
  PROCESSING: {
    DATA_MAPPING_FAILED: "Data mapping failed",
  },
  INTERNAL_SERVER_ERROR: "Internal server error",
};

export const AUTH_MESSAGES = {
  TOKEN_REQUIRED: "Access token is required",
  USER_NOT_FOUND: "User not found",
  TOKEN_REVOKED: "Token has been revoked",
  UNAUTHORIZED: "Unauthorized access",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_TOKEN: "Invalid token",
  ACCESS_DENIED: "Access denied",
};

export const COMMON_MESSAGES = {
  MISSING_ENV_VARS: "Missing environment variables",
  ENV_VARS_VALIDATED: "Environment variables validated successfully",
  CONFIG_INITIALIZED: "Configuration initialized successfully",
  CONFIG_INIT_FAILED: "Configuration initialization failed",
  START_DATE_BEFORE_END_DATE: "Start date must be before end date",
  DATE_RANGE_EXCEED_ONE_YEAR: "Date range cannot exceed one year",
  DATE_CANNOT_BE_FUTURE: "Date cannot be in the future",
};

export default {
  ERROR_MESSAGES,
  QUICKBOOKS_ERROR_MESSAGES,
  QUICKBOOKS_HEALTH_MESSAGES,
  QUICKBOOKS_COMMON_MESSAGES,
  QUICKBOOKS_MESSAGES,
  QUICKBOOKS_REPORTS_MESSAGES,
  QUICKBOOKS_VALIDATION_ERROR_MESSAGES,
  AUTH_MESSAGES,
  COMMON_MESSAGES,
};

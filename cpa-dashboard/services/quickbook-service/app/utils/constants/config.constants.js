



export const CONFIG_DEFAULTS = {
  NODE_ENV: 'development',
  LOG_INFO_LEVEL: 'info',
  LOG_ERROR_LEVEL: 'error',
  LOG_DIRECTORY: './logs',
  LOG_MAX_SIZE: '20m',
  LOG_MAX_FILES: 14,
  LOG_ZIPPED_ARCHIVE: true,
  BCRYPT_ROUNDS: 12,
  COOKIE_MAX_AGE: 86400000,
  QUICKBOOKS_RESPONSE_TYPE: 'code',
};

export const CONFIG_ENV_TYPES = {
  NUMBER: 'number',
};

export const ENV_TYPES = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
  TEST: 'test',
};

export const DATE_FORMAT_PATTERNS = {
  YEAR: 'YYYY',
  MONTH: 'MM',
  DAY: 'DD',
  HOURS: 'HH',
  MINUTES: 'mm',
  SECONDS: 'ss',
};

export const ENCRYPTION_DEFAULTS = {
  ALGORITHM: 'aes-256-cbc',
};

export const ENCRYPTION_MESSAGES = {
  KEY_MISSING: 'Encryption key',
};

export const DATE_FORMATS = {
  DATE_PATTERN: 'YYYY-MM-DD',
  LOG_FORMAT: 'YYYY-MM-DD HH:mm:ss',
};


export const CONFIG_VALIDATION = {
  REQUIRED_QUICKBOOKS_VARS: [
    'QUICKBOOKS_CLIENT_ID',
    'QUICKBOOKS_CLIENT_SECRET',
    'QUICKBOOKS_REDIRECT_URI',
    'QUICKBOOKS_TOKEN_URL',
  ],
  ENCRYPTION_KEY_MIN_LENGTH: 32,
};










export const QUICKBOOKS_FIELD_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  COMPANY_NAME: 'company_name',
  EMAIL: 'email',
  UPDATED_AT: 'updated_at',
  ORGANIZATION_ID: 'organization_id',
  REALM_ID: 'realm_id',
  IS_DELETED: 'is_deleted',
  QUICKBOOK_ACCOUNT_ID: 'quickbook_account_id',
  TOKEN_EXPIRY_TIME: 'token_expiry_time',
  ARITEK_ID: 'aritek_id',
  USER_ID: 'user_id',
  STATUS: 'status',
  LAST_SYNCED: 'last_synced',
};



export const QUICKBOOKS_VALIDATION = {
  REQUIRED_FIELDS: {
    ADD_ACCOUNT: ['code', 'organization_id'],
    ADD_TOKEN: ['id', 'refresh_token', 'access_token'],
    GET_TOKENS: ['id'],
    SYNC_DATA: ['organization_id', 'id'],
  },
  FIELD_LENGTHS: {
    MAX_TEXT_LENGTH: 4000,
    MAX_STRING_LENGTH: 255,
  },
};



export const QUICKBOOKS_STATUS = {
  AUTOMATIC: 'automatic',
  COMPLETED: 'completed',
  FAILED: 'failed',
};



export const QUICKBOOKS_HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
};






export const QUICKBOOKS_DEFAULTS = {
  SQL_ERROR_FOREIGN_KEY: 547,
  SQL_ERROR_DUPLICATE: 2627,
  POSTGRES_UNIQUE_VIOLATION: '23505',
  REQUEST_TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  TOKEN_EXPIRY_MS: 3600000,
  POOL_MIN: 2,
  POOL_MAX: 10,
  POOL_ACQUIRE_TIMEOUT: 60000,
  POOL_IDLE_TIMEOUT: 300000,
  POOL_CREATE_TIMEOUT: 30000,
  POOL_DESTROY_TIMEOUT: 5000,
  POOL_REAP_INTERVAL: 1000,
  POOL_RETRY_INTERVAL: 200,
  BATCH_SIZE: 1000,
  DATABASE_NAME_PREFIX: 'QB_',
  DATABASE_NAME_SUFFIX: '_DB',
  UPLOAD_DIRECTORY_PREFIX: 'uploads/quickbooks/',
  DEFAULT_UPLOAD_DIR: 'uploads/quickbooks',
  GRANT_TYPE_AUTH_CODE: 'authorization_code',
  GRANT_TYPE_REFRESH: 'refresh_token',
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
  AUTH_BASIC_PREFIX: 'Basic ',
};






export const QUICKBOOKS_LOGGER_NAMES = {
  AWS_CONFIG: 'AWS_CONFIG',
  QUICKBOOKS_CONTROLLER: 'QUICKBOOKS_CONTROLLER',
  QUICKBOOKS_SERVICE: 'QUICKBOOKS_SERVICE',
  QUICKBOOKS_REPOSITORY: 'QUICKBOOKS_REPOSITORY',
  QUICKBOOKS_MIDDLEWARE: 'QUICKBOOKS_MIDDLEWARE',
};




export const QUICKBOOKS_SEQUELIZE_OPERATORS = {
  NE: 'ne',
  IN: 'in',
  GTE: 'gte',
  LTE: 'lte',
};

export const QUICKBOOKS_DATABASE = {
  QB_DB_CONNECTION_CLOSED: 'Connection closed',
  QB_DB_CONNECTION_TIMEOUT: 'Connection timeout',
  ERROR_TYPES: {
    TIMEOUT: 'timeout',
    ETIMEOUT: 'ETIMEOUT',
    ECONNRESET: 'ECONNRESET',
  },
};

export const QUICKBOOKS_SERVICE_CONFIG = {
  DEFAULT_PORT: 3001,
  SERVICE_NAME: 'cpa-dashboard-quickbooks-service',
};

export const QUICKBOOKS_CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN,
  CREDENTIALS: true,
};

export const QUICKBOOKS_SESSION_CONFIG = {
  SECRET: process.env.SESSION_SECRET,
  RESAVE: false,
  SAVE_UNINITIALIZED: false,
  COOKIE: {
    SECURE: process.env.NODE_ENV === 'production',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },
};

export const QUICKBOOKS_REQUEST_CONFIG = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
};

export const QUICKBOOKS_AVAILABLE_ENDPOINTS = [
  'GET /health',
  'GET /api/v1/quickbooks/accounts',
  'POST /api/v1/quickbooks/accounts',
  'POST /api/v1/quickbooks/tokens',
  'POST /api/v1/quickbooks/sync',
  'PUT /api/v1/quickbooks/accounts/:id/disable',
  'GET /api/v1/quickbooks/reports/trial-balance',
  'GET /api/v1/quickbooks/reports/profit-loss',
  'GET /api/v1/quickbooks/reports/balance-sheet',
];

export const QUICKBOOKS_PROCESS_SIGNALS = {
  SIGTERM: 'SIGTERM',
  SIGINT: 'SIGINT',
};

export const QUICKBOOKS_SERVER_ERROR_CODES = {
  EADDRINUSE: 'EADDRINUSE',
};

export const QUICKBOOKS_DEFAULT_VALUES = {
  PORT: 3001,
  HOST: 'localhost',
};




export default {
  CONFIG_DEFAULTS,
  CONFIG_ENV_TYPES,
  ENV_TYPES,
  DATE_FORMAT_PATTERNS,
  ENCRYPTION_DEFAULTS,
  ENCRYPTION_MESSAGES,
  DATE_FORMATS,
  CONFIG_VALIDATION,
  QUICKBOOKS_FIELD_NAMES,
  QUICKBOOKS_VALIDATION,
  QUICKBOOKS_STATUS,
  QUICKBOOKS_HTTP_HEADERS,
  QUICKBOOKS_DEFAULTS,
  QUICKBOOKS_LOGGER_NAMES,
  QUICKBOOKS_SEQUELIZE_OPERATORS,
  QUICKBOOKS_DATABASE,
  QUICKBOOKS_SERVICE_CONFIG,
  QUICKBOOKS_CORS_CONFIG,
  QUICKBOOKS_SESSION_CONFIG,
  QUICKBOOKS_REQUEST_CONFIG,
  QUICKBOOKS_AVAILABLE_ENDPOINTS,
  QUICKBOOKS_PROCESS_SIGNALS,
  QUICKBOOKS_SERVER_ERROR_CODES,
  QUICKBOOKS_DEFAULT_VALUES,
};

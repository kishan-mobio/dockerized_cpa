// CONFIGURATION CONSTANTS - All Configuration Related Constants

// Configuration Defaults
export const CONFIG_DEFAULTS = {
  NODE_ENV: 'development',
  DB_PORT: '5432',
  DB_POOL_MAX: 10,
  DB_POOL_MIN: 0,
  DB_POOL_ACQUIRE: 30000,
  DB_POOL_IDLE: 10000,
  BCRYPT_ROUNDS: 8,
  COOKIE_MAX_AGE: 3600000,
  LOG_MAX_FILES: 14,
  LOG_DIRECTORY: 'logs',
  LOG_INFO_LEVEL: 'info',
  LOG_ERROR_LEVEL: 'error',
  LOG_ZIPPED_ARCHIVE: true,
  LOG_MAX_SIZE: '20m',
};

// Environment Types
export const CONFIG_ENV_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  JSON: 'json',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Date Formats
export const DATE_FORMATS = {
  DATE_PATTERN: 'YYYY-MM-DD',
  LOG_FORMAT: 'YYYY-MM-DD HH:mm:ss',
};

// Time Constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_MINUTE: 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  COOKIE_AGE: 24 * 60 * 60 * 1000,
  TOKEN_EXPIRY_HOURS: 1,
  TOKEN_EXPIRY_MS: 3600000, // 1 hour in milliseconds
};

// Environment Types
export const ENV_TYPES = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
  TEST: 'test',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
};

// Cookie Configuration
export const COOKIE_CONFIG = {
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV !== 'development',
  SAME_SITE: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
  MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE || '3600000'),
  PATH: '/',
  DOMAIN: process.env.COOKIE_DOMAIN,
  STRICT: 'strict',
  ACCESS_MAX_AGE: 15 * 60 * 1000,
  REFRESH_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
};

// Token Configuration
export const TOKEN_CONFIG = {
  ACCESS: { KEY: 'accessToken', TYPE: 'access' },
  REFRESH: { KEY: 'refreshToken', TYPE: 'refresh' },
  AUDIT_TYPE: 'tokenRefresh',
  SERVICE_NAME: 'token-refresh-service',
};

// Audit Constants
export const AUDIT_EVENTS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  TOKEN_REFRESH: 'tokenRefresh',
  FAILED_LOGIN: 'failedLogin',
  PASSWORD_CHANGE: 'passwordChange',
};

export const AUDIT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export const AUDIT_CONFIG = {
  RETENTION_DAYS: 30,
};

// Data Types
export const DATA_TYPES = {
  OBJECT: 'object',
  STRING: 'string',
  FUNCTION: 'function',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
};

// Boolean Values
export const BOOLEAN_VALUES = {
  TRUE: true,
  FALSE: false,
};

// Health Check
export const HEALTH_CHECK_ENDPOINT = '/health';

// Default export for backward compatibility
export default {
  CONFIG_DEFAULTS,
  CONFIG_ENV_TYPES,
  DATE_FORMATS,
  TIME_CONSTANTS,
  ENV_TYPES,
  HTTP_METHODS,
  COOKIE_CONFIG,
  TOKEN_CONFIG,
  AUDIT_EVENTS,
  AUDIT_SEVERITY,
  AUDIT_CONFIG,
  DATA_TYPES,
  BOOLEAN_VALUES,
  HEALTH_CHECK_ENDPOINT,
};

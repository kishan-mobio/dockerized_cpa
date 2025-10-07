export const LOGGER_NAMES = {
  DATE_UTILS: 'DATE_UTILS',
  DATABASE_UTILS: 'DATABASE_UTILS',
  JWT_UTILS: 'JWT_UTILS',
  ERROR_UTILS: 'ERROR_UTILS',
  ENV_VALIDATOR: 'ENV_VALIDATOR',
  SENDGRID_EMAIL_UTILS: 'SENDGRID_EMAIL_UTILS',
};

export const RATE_LIMIT_MESSAGES = {
  GENERAL_ERROR: 'Too many requests from this IP, please try again later.',
  TOO_MANY_ATTEMPTS: 'Too many attempts, please try again later.',
  AUTH_ERROR: 'Too many authentication attempts, please try again later.',
  API_LIMIT_EXCEEDED: 'API rate limit exceeded, please try again later.',
  SIGNUP_ERROR: 'Too many signup attempts, please try again later.',
  FILE_UPLOAD_ERROR: 'Too many file uploads, please try again later.',
};
export const RATE_LIMIT_LOG = {
  LIMIT_EXCEEDED: (ip) => `Rate limit exceeded for IP: ${ip}`,
  STRICT_LIMIT_EXCEEDED: (ip) => `Strict rate limit exceeded for IP: ${ip}`,
  AUTH_LIMIT_EXCEEDED: (ip) => `Auth rate limit exceeded for IP: ${ip}`,
  API_LIMIT_EXCEEDED: (ip) => `API rate limit exceeded for IP: ${ip}`,
  SIGNUP_LIMIT_EXCEEDED: (ip) => `Signup rate limit exceeded for IP: ${ip}`,
  FILE_UPLOAD_LIMIT_EXCEEDED: (ip) => `File upload rate limit exceeded for IP: ${ip}`,
};


export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export const LOG_FORMATS = {
  COMBINED: 'combined',
  COMMON: 'common',
  DEV: 'dev',
  SHORT: 'short',
  TINY: 'tiny',
};


export const DATABASE_REPOSITORY_LOGS = {
  RECORD_CREATED: (modelName, id) => `Record created in ${modelName} with ID: ${id}`,
  CREATE_ERROR: (modelName, error) => `Error creating record in ${modelName}: ${error}`,
  RECORD_FOUND: (modelName, id) => `Record found in ${modelName} with ID: ${id}`,
  RECORD_NOT_FOUND: (modelName, id) => `Record not found in ${modelName} with ID: ${id}`,
  FIND_ERROR: (modelName, id, error) => `Error finding record in ${modelName} with ID ${id}: ${error}`,
  RECORD_UPDATED: (modelName, id) => `Record updated in ${modelName} with ID: ${id}`,
  NO_RECORD_TO_UPDATE: (modelName, id) => `No record to update in ${modelName} with ID: ${id}`,
  UPDATE_ERROR: (modelName, id, error) => `Error updating record in ${modelName} with ID ${id}: ${error}`,
  RECORD_SOFT_DELETED: (modelName, id) => `Record soft deleted in ${modelName} with ID: ${id}`,
  NO_RECORD_TO_DELETE: (modelName, id) => `No record to delete in ${modelName} with ID: ${id}`,
  DELETE_ERROR: (modelName, id, error) => `Error deleting record in ${modelName} with ID ${id}: ${error}`,
  RECORDS_FOUND: (modelName, count) => `Found ${count} records in ${modelName}`,
  FIND_ALL_ERROR: (modelName, error) => `Error finding all records in ${modelName}: ${error}`,
  RECORDS_PAGINATED: (modelName, page, limit, total) => `Paginated ${modelName}: page ${page}, limit ${limit}, total ${total}`,
  PAGINATION_ERROR: (modelName, error) => `Error paginating records in ${modelName}: ${error}`,
  RECORD_EXISTS_CHECK: (modelName, id, exists) => `Record exists check in ${modelName} with ID ${id}: ${exists}`,
  EXISTS_CHECK_ERROR: (modelName, id, error) => `Error checking if record exists in ${modelName} with ID ${id}: ${error}`,
  RECORDS_COUNTED: (modelName, count) => `Counted ${count} records in ${modelName}`,
  COUNT_ERROR: (modelName, error) => `Error counting records in ${modelName}: ${error}`,
};

export default {
  LOGGER_NAMES,
  LOG_LEVELS,
  LOG_FORMATS,
  DATABASE_REPOSITORY_LOGS,
};

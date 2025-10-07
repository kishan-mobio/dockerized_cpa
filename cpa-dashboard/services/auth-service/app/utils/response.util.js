import { ENV_TYPES } from './constants/config.constants.js';
import { STATUS_CODE_INTERNAL_SERVER_ERROR } from './status_code.utils.js';

/**
 * Response utility constants
 */
const RESPONSE_CONSTANTS = {
  SUCCESS_STATUS: true,
  ERROR_STATUS: false,
  DEFAULT_SUCCESS_MESSAGE: 'Operation completed successfully',
  DEFAULT_ERROR_MESSAGE: 'An error occurred',
};

/**
 * Creates a standardized success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {Object} metadata - Additional metadata
 * @param {Object} options - Response options
 * @returns {Object} Standardized success response
 */
export const successResponse = (message = RESPONSE_CONSTANTS.DEFAULT_SUCCESS_MESSAGE, data = null, metadata = {}, options = {}) => {
  const {
    includeTimestamp = true,
    includeMetadata = true,
    statusCode: _statusCode = 200,
  } = options;

  const response = {
    success: RESPONSE_CONSTANTS.SUCCESS_STATUS,
    message: message ? message : RESPONSE_CONSTANTS.DEFAULT_SUCCESS_MESSAGE,
    ...(data !== null && { data }),
    ...(includeTimestamp && { timestamp: new Date().toISOString() }),
    ...(includeMetadata && Object.keys(metadata).length > 0 && { metadata }),
  };

  // Add debug information in development
  if (process.env.NODE_ENV === ENV_TYPES.DEVELOPMENT && options.debug) {
    response.debug = options.debug;
  }

  return response;
};

/**
 * Creates a standardized error response
 * @param {string} message - Error message
 * @param {*} data - Error data/details
 * @param {Object} metadata - Additional metadata
 * @param {Object} options - Response options
 * @returns {Object} Standardized error response
 */
export const errorResponse = (message = RESPONSE_CONSTANTS.DEFAULT_ERROR_MESSAGE, data = null, metadata = {}, options = {}) => {
  const {
    includeTimestamp = true,
    includeMetadata = true,
    statusCode: _statusCode = STATUS_CODE_INTERNAL_SERVER_ERROR,
    errorCode = null,
    includeStack = process.env.NODE_ENV === ENV_TYPES.DEVELOPMENT,
  } = options;

  const response = {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message: message ? message : ERROR_MESSAGES.GENERAL,
    ...(data !== null && { data }),
    ...(includeTimestamp && { timestamp: new Date().toISOString() }),
    ...(includeMetadata && Object.keys(metadata).length > 0 && { metadata }),
    ...(errorCode && { errorCode }),
  };

  // Add stack trace in development
  if (includeStack && options.stack) {
    response.stack = options.stack;
  }

  return response;
};

/**
 * Creates a paginated response
 * @param {Array} data - Array of data items
 * @param {Object} pagination - Pagination information
 * @param {string} message - Success message
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Paginated response
 */
export const paginatedResponse = (data, pagination, message = RESPONSE_MESSAGES.DATA_RETRIEVED_SUCCESS, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.SUCCESS_STATUS,
    message,
    data,
    pagination: {
      page: pagination.page ? pagination.page : 1,
      limit: pagination.limit ? pagination.limit : 10,
      total: pagination.total ? pagination.total : 0,
      totalPages: Math.ceil((pagination.total ? pagination.total : 0) / (pagination.limit ? pagination.limit : 10)),
      hasNext: pagination.hasNext ? pagination.hasNext : false,
      hasPrev: pagination.hasPrev ? pagination.hasPrev : false,
    },
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a validation error response
 * @param {Array} errors - Array of validation errors
 * @param {string} message - Error message
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Validation error response
 */
export const validationErrorResponse = (errors, message = RESPONSE_MESSAGES.VALIDATION_FAILED, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message,
    errors: errors.map(error => ({
      field: error.field ? error.field : error.path,
      message: error.message,
      value: error.value,
      ...(error.code && { code: error.code }),
    })),
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a not found response
 * @param {string} resource - Resource name that was not found
 * @param {string} identifier - Identifier that was searched
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Not found response
 */
export const notFoundResponse = (resource = RESPONSE_DEFAULTS.RESOURCE, identifier = null, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message: `${resource} not found${identifier ? ` with identifier: ${identifier}` : ''}`,
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a conflict response
 * @param {string} resource - Resource name that has conflict
 * @param {string} field - Field that has conflict
 * @param {string} value - Value that caused conflict
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Conflict response
 */
export const conflictResponse = (resource = RESPONSE_DEFAULTS.RESOURCE, field = 'field', value = null, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message: `${resource} with this ${field} already exists${value ? `: ${value}` : ''}`,
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a rate limit response
 * @param {number} retryAfter - Seconds to wait before retry
 * @param {string} resource - Resource that was rate limited
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Rate limit response
 */
export const rateLimitResponse = (retryAfter = 60, resource = RESPONSE_DEFAULTS.API, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message: `${resource} rate limit exceeded. Try again in ${retryAfter} seconds.`,
    retryAfter,
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a service unavailable response
 * @param {string} service - Service name that is unavailable
 * @param {string} reason - Reason for unavailability
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Service unavailable response
 */
export const serviceUnavailableResponse = (service = RESPONSE_DEFAULTS.SERVICE, reason = RESPONSE_DEFAULTS.TEMPORARILY_UNAVAILABLE, metadata = {}) => {
  return {
    success: RESPONSE_CONSTANTS.ERROR_STATUS,
    message: `${service} is ${reason}. Please try again later.`,
    timestamp: new Date().toISOString(),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

/**
 * Creates a response with custom status code
 * @param {boolean} success - Response success status
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @param {Object} options - Additional options
 * @returns {Object} Custom response
 */
export const customResponse = (success, message, data = null, statusCode = 200, options = {}) => {
  const {
    includeTimestamp = true,
    metadata = {},
    errorCode = null,
  } = options;

  return {
    success,
    message,
    ...(data !== null && { data }),
    ...(includeTimestamp && { timestamp: new Date().toISOString() }),
    ...(Object.keys(metadata).length > 0 && { metadata }),
    ...(errorCode && { errorCode }),
    ...(process.env.NODE_ENV === ENV_TYPES.DEVELOPMENT && { statusCode }),
  };
};

/**
 * Wraps an async function with standardized error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} operation - Operation name for logging
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (fn, operation = ERROR_FIELDS.OPERATION, options = {}) => {
  const {
    defaultErrorMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    includeStack = process.env.NODE_ENV === ENV_TYPES.DEVELOPMENT,
  } = options;

  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return errorResponse(
        error.message ? error.message : defaultErrorMessage,
        null,
        { operation, errorType: error.name },
        {
          includeStack,
          stack: error.stack,
          errorCode: error.code,
        }
      );
    }
  };
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  notFoundResponse,
  conflictResponse,
  rateLimitResponse,
  serviceUnavailableResponse,
  customResponse,
  withErrorHandling,
};

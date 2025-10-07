import { ERROR_MESSAGES } from './constants/error.constants.js';
import { ENV_TYPES } from './constants/config.constants.js';

/**
 * Response utility constants
 */
const RESPONSE_CONSTANTS = {
  SUCCESS_STATUS: true,
  ERROR_STATUS: false,
  DEFAULT_SUCCESS_MESSAGE: 'Operation completed successfully',
  DEFAULT_ERROR_MESSAGE: ERROR_MESSAGES.GENERAL,
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
    statusCode: _statusCode = 500,
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


export default {
  successResponse,
  errorResponse,
};

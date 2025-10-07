import { createLogger } from "./logger.util.js";
import {
  ERROR_CLASS_NAMES,
  ERROR_DEFAULT_MESSAGES,
  ERROR_CODES,
  ERROR_MESSAGES,
  LOGGER_COMPONENT_NAMES,
  QUICKBOOKS_MESSAGES,
} from "./constants.util.js";
import * as status from "./status_code.util.js";

const logger = createLogger(LOGGER_COMPONENT_NAMES.ERROR_UTILS);

// Common response object builder
const buildErrorResponse = ({
  code,
  message,
  statusCode,
  details = undefined,
  extra = {},
}) => {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
    ...extra,
  };
  if (details !== undefined) response.error.details = details;
  return { status: statusCode, response };
};

// Error constructor functions
export const createStorageError = (
  message,
  code = ERROR_CODES.STORAGE_ERROR
) => {
  const error = new Error(message);
  error.name = ERROR_CLASS_NAMES.STORAGE_ERROR;
  error.code = code;
  error.statusCode = status.STATUS_CODE_INTERNAL_SERVER_STATUS;
  return error;
};

export const createBadRequestError = (
  message,
  code = ERROR_CODES.BAD_REQUEST_ERROR
) => {
  const error = new Error(message);
  error.name = ERROR_CLASS_NAMES.BAD_REQUEST_ERROR;
  error.code = code;
  error.statusCode = status.STATUS_CODE_BAD_REQUEST;
  return error;
};

export const createValidationError = (
  message,
  code = ERROR_CODES.VALIDATION_ERROR,
  details = []
) => {
  const error = new Error(message);
  error.name = ERROR_CLASS_NAMES.VALIDATION_ERROR;
  error.code = code;
  error.statusCode = status.STATUS_CODE_BAD_REQUEST;
  error.details = details;
  return error;
};

export const createDatabaseError = (
  message,
  code = ERROR_CODES.DATABASE_ERROR,
  originalError = null
) => {
  const error = new Error(message);
  error.name = ERROR_CLASS_NAMES.DATABASE_ERROR;
  error.code = code;
  error.statusCode = status.STATUS_CODE_INTERNAL_SERVER_STATUS;
  error.originalError = originalError;
  return error;
};

/**
 * Centralized Error Handling Utilities
 * Provides standardized error handling and response formatting
 */
export const errorHandler = {
  /**
   * Handle and format validation errors
   * @param {Error} error - Validation error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleValidationError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Validation error in ${module}:`, error);
    return buildErrorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: error.message || ERROR_MESSAGES.BAD_REQUEST,
      statusCode: status.STATUS_CODE_BAD_REQUEST,
      details: error.details || {},
    });
  },

  /**
   * Handle and format authentication errors
   * @param {Error} error - Authentication error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleAuthenticationError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Authentication error in ${module}:`, error);
    return buildErrorResponse({
      code: ERROR_CODES.AUTHENTICATION_ERROR,
      message: error.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
      statusCode: status.STATUS_CODE_UNAUTHORIZED,
    });
  },

  /**
   * Handle and format authorization errors
   * @param {Error} error - Authorization error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleAuthorizationError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Authorization error in ${module}:`, error);
    return buildErrorResponse({
      code: ERROR_CODES.AUTHORIZATION_ERROR,
      message: error.message || ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: status.STATUS_CODE_FORBIDDEN,
    });
  },

  /**
   * Handle and format not found errors
   * @param {string} resource - Resource that was not found
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleNotFoundError(
    resource = ERROR_DEFAULT_MESSAGES.RESOURCE,
    module = ERROR_CLASS_NAMES.UNKNOWN_MODULE
  ) {
    logger.warn(`${resource} not found in ${module}`);
    return buildErrorResponse({
      code: ERROR_CODES.NOT_FOUND_ERROR,
      message: `${resource} not found`,
      statusCode: status.STATUS_CODE_NOT_FOUND,
    });
  },

  /**
   * Handle and format duplicate/conflict errors
   * @param {string} resource - Resource that has conflict
   * @param {string} field - Field that has duplicate value
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleDuplicateError(
    resource = ERROR_DEFAULT_MESSAGES.RESOURCE,
    field = ERROR_DEFAULT_MESSAGES.FIELD,
    module = ERROR_CLASS_NAMES.UNKNOWN_MODULE
  ) {
    logger.warn(`Duplicate ${field} in ${resource} - ${module}`);
    return buildErrorResponse({
      code: ERROR_CODES.DUPLICATE_ERROR,
      message: `${resource} with this ${field} already exists`,
      statusCode: status.STATUS_CODE_CONFLICT,
    });
  },

  /**
   * Handle and format foreign key errors
   * @param {string} foreignKeyField - Foreign key field name
   * @param {string} referencedResource - Referenced resource name
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleForeignKeyError(
    foreignKeyField,
    referencedResource,
    module = ERROR_CLASS_NAMES.UNKNOWN_MODULE
  ) {
    logger.error(
      `Foreign key error in ${module}: ${foreignKeyField} -> ${referencedResource}`
    );
    return buildErrorResponse({
      code: ERROR_CODES.FOREIGN_KEY_ERROR,
      message: `${referencedResource} not found for the given ${foreignKeyField}`,
      statusCode: status.STATUS_CODE_BAD_REQUEST,
    });
  },

  /**
   * Handle and format database errors
   * @param {Error} error - Database error
   * @param {string} operation - Database operation that failed
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleDatabaseError(
    error,
    operation = ERROR_DEFAULT_MESSAGES.DATABASE_OPERATION,
    module = ERROR_CLASS_NAMES.UNKNOWN_MODULE
  ) {
    logger.error(`Database error in ${module} during ${operation}:`, error);
    if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
      return this.handleDuplicateError(
        module,
        error.fields?.[0] || "field",
        module
      );
    }
    if (
      error.name === ERROR_CLASS_NAMES.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR
    ) {
      return this.handleForeignKeyError(
        error.fields?.[0] || "foreign_key",
        "referenced record",
        module
      );
    }
    if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_VALIDATION_ERROR) {
      return this.handleValidationError(error, module);
    }
    return buildErrorResponse({
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      statusCode: status.STATUS_CODE_INTERNAL_SERVER_STATUS,
    });
  },

  /**
   * Handle and format general internal server errors
   * @param {Error} error - General error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleInternalServerError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Internal server error in ${module}:`, error);
    return buildErrorResponse({
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      statusCode: status.STATUS_CODE_INTERNAL_SERVER_STATUS,
    });
  },

  /**
   * Generic error handler that determines error type and handles accordingly
   * @param {Error} error - Error object
   * @param {string} module - Module name where error occurred
   * @param {string} operation - Operation that was being performed
   * @returns {Object} Formatted error response with status code
   */
  handleError(
    error,
    module = ERROR_CLASS_NAMES.UNKNOWN_MODULE,
    operation = "operation"
  ) {
    logger.error(`Error in ${module} during ${operation}:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (error.code === ERROR_CODES.DUPLICATE_ERROR) {
      return buildErrorResponse({
        code: ERROR_CODES.DUPLICATE_ERROR,
        message:
          error.message || ERROR_DEFAULT_MESSAGES.RESOURCE_ALREADY_EXISTS,
        statusCode: status.STATUS_CODE_CONFLICT,
      });
    }
    if (error.code === ERROR_CODES.FOREIGN_KEY_ERROR) {
      return buildErrorResponse({
        code: ERROR_CODES.FOREIGN_KEY_ERROR,
        message: error.message || ERROR_DEFAULT_MESSAGES.INVALID_FOREIGN_KEY,
        statusCode: status.STATUS_CODE_BAD_REQUEST,
      });
    }
    if (
      error.name === ERROR_CLASS_NAMES.VALIDATION_ERROR ||
      error.name === ERROR_CLASS_NAMES.SEQUELIZE_VALIDATION_ERROR
    ) {
      return this.handleValidationError(error, module);
    }
    if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
      return this.handleDuplicateError(
        module,
        error.fields?.[0] || "field",
        module
      );
    }
    if (
      error.name === ERROR_CLASS_NAMES.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR
    ) {
      return this.handleForeignKeyError(
        error.fields?.[0] || "foreign_key",
        "referenced record",
        module
      );
    }
    if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_DATABASE_ERROR) {
      return this.handleDatabaseError(error, operation, module);
    }
    if (
      error.name === ERROR_CLASS_NAMES.UNAUTHORIZED_ERROR ||
      error.message?.includes("unauthorized")
    ) {
      return this.handleAuthenticationError(error, module);
    }
    if (
      error.name === ERROR_CLASS_NAMES.FORBIDDEN_ERROR ||
      error.message?.includes("forbidden")
    ) {
      return this.handleAuthorizationError(error, module);
    }
    if (
      error.name === ERROR_CLASS_NAMES.NOT_FOUND_ERROR ||
      error.message?.includes("not found")
    ) {
      return this.handleNotFoundError(ERROR_DEFAULT_MESSAGES.RESOURCE, module);
    }
    return this.handleInternalServerError(error, module);
  },

  /**
   * Create a standardized error object
   * @param {string} code - Error code
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   * @returns {Error} Standardized error object
   */
  createError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    error.details = details;
    return error;
  },

  /**
   * Middleware for handling uncaught errors in Express routes
   * @param {Error} error - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  expressErrorHandler(error, req, res, _next) {
    const { status: statusCode, response } = this.handleError(
      error,
      req.route?.path || ERROR_DEFAULT_MESSAGES.UNKNOWN_ROUTE,
      req.method
    );

    res.status(statusCode).json(response);
  },

  /**
   * Format error response with context and metadata
   * @param {Error} error - Error object
   * @param {string} context - Error context
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Formatted error response
   */
  formatErrorResponse(
    error,
    context = ERROR_CLASS_NAMES.UNKNOWN_MODULE,
    metadata = {}
  ) {
    const errorId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    logger.error(`[${errorId}] ${context} error:`, {
      message: error.message,
      stack: error.stack,
      metadata,
      timestamp: new Date().toISOString(),
    });

    return {
      status: false,
      message: context,
      errorId,
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    };
  },

  /**
   * Handle QuickBooks specific errors
   * @param {Error} error - QuickBooks error
   * @param {string} operation - Operation that failed
   * @param {Object} context - Additional context
   * @returns {Object} Formatted QuickBooks error response
   */
  handleQuickBooksError(error, operation, context = {}) {
    const isUnauthorized =
      error.response?.status === status.STATUS_CODE_UNAUTHORIZED;
    const isRateLimited = error.response?.status === 429;
    const isServerError = error.response?.status >= 500;

    let message = `${QUICKBOOKS_MESSAGES.OPERATION_FAILED.replace(
      "operation",
      operation
    )}`;
    let shouldRetry = false;

    if (isUnauthorized) {
      message = QUICKBOOKS_MESSAGES.AUTH_EXPIRED;
    } else if (isRateLimited) {
      message = QUICKBOOKS_MESSAGES.RATE_LIMITED;
      shouldRetry = true;
    } else if (isServerError) {
      message = QUICKBOOKS_MESSAGES.SERVICE_UNAVAILABLE;
      shouldRetry = true;
    }

    return {
      ...this.formatErrorResponse(error, message, {
        operation,
        context,
        httpStatus: error.response?.status,
        shouldRetry,
      }),
      isQuickBooksError: true,
      shouldRetry,
      httpStatus: error.response?.status || 500,
    };
  },

  /**
   * Handle database specific errors
   * @param {Error} error - Database error
   * @param {string} operation - Database operation
   * @param {Object} context - Additional context
   * @returns {Object} Formatted database error response
   */
  handleDatabaseErrorResponse(error, operation, context = {}) {
    let message = `Database ${operation} failed`;

    if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_VALIDATION_ERROR) {
      message = ERROR_DEFAULT_MESSAGES.DATA_VALIDATION_FAILED;
    } else if (
      error.name === ERROR_CLASS_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR
    ) {
      message = ERROR_DEFAULT_MESSAGES.DUPLICATE_ENTRY_DETECTED;
    } else if (
      error.name === ERROR_CLASS_NAMES.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR
    ) {
      message = ERROR_DEFAULT_MESSAGES.REFERENCE_CONSTRAINT_VIOLATION;
    } else if (error.name === ERROR_CLASS_NAMES.SEQUELIZE_CONNECTION_ERROR) {
      message = ERROR_DEFAULT_MESSAGES.DATABASE_CONNECTION_FAILED;
    }

    return {
      ...this.formatErrorResponse(error, message, {
        operation,
        context,
        errorType: error.name,
      }),
      isDatabaseError: true,
      errorType: error.name,
    };
  },

  /**
   * Format validation errors
   * @param {Array} validationErrors - Array of validation errors
   * @param {string} context - Validation context
   * @returns {Object} Formatted validation error response
   */
  formatValidationError(
    validationErrors,
    context = ERROR_DEFAULT_MESSAGES.VALIDATION_FAILED
  ) {
    const errorId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    logger.warn(`[${errorId}] ${context}:`, { errors: validationErrors });

    return {
      status: false,
      message: context,
      errorId,
      errors: validationErrors.map((err) => ({
        field: err.field || err.path,
        message: err.message,
        value: err.value,
      })),
    };
  },

  /**
   * Handle rate limit errors
   * @param {number} retryAfter - Seconds to wait before retry
   * @param {string} resource - Resource that was rate limited
   * @returns {Object} Formatted rate limit error response
   */
  handleRateLimitError(
    retryAfter = 60,
    resource = ERROR_DEFAULT_MESSAGES.API_RESOURCE
  ) {
    const message = `${resource} rate limit exceeded. Try again in ${retryAfter} seconds.`;
    logger.warn("Rate limit exceeded:", { resource, retryAfter });

    return {
      status: false,
      message,
      retryAfter,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Format success response
   * @param {Object} data - Response data
   * @param {string} message - Success message
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Formatted success response
   */
  formatSuccessResponse(
    data,
    message = ERROR_DEFAULT_MESSAGES.OPERATION_SUCCESSFUL,
    metadata = {}
  ) {
    return {
      status: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      ...metadata,
    };
  },

  /**
   * Wrapper for error handling in async functions
   * @param {Function} fn - Async function to wrap
   * @param {string} operation - Operation name
   * @param {Function} errorHandler - Custom error handler
   * @returns {Function} Wrapped function with error handling
   */
  withErrorHandling(fn, operation, customErrorHandler = null) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        if (customErrorHandler) {
          return customErrorHandler(error, operation, { args });
        }

        // Default error handling
        if (error.response) {
          return this.handleQuickBooksError(error, operation);
        } else if (error.name && error.name.startsWith("Sequelize")) {
          return this.handleDatabaseErrorResponse(error, operation);
        }

        return this.formatErrorResponse(error, operation);
      }
    };
  },
};

export default errorHandler;

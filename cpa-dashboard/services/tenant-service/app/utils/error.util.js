import { createLogger } from "./logger.util.js";
import {
  ERROR_CLASS_NAMES,
  ERROR_DEFAULT_MESSAGES,
  ERROR_CODES,
  ERROR_MESSAGES,
  LOGGER_COMPONENT_NAMES,
} from "./constants.util.js";
import * as status from "./status_code.util.js";

const logger = createLogger(LOGGER_COMPONENT_NAMES.ERROR_UTILS);

/**
 * Common response object builder
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error response with status code
 */
const buildErrorResponse = (
  message,
  statusCode = status.STATUS_CODE_INTERNAL_SERVER_STATUS
) => {
  return { status: statusCode, message };
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
    return buildErrorResponse(
      error.message || ERROR_CODES.VALIDATION_ERROR,
      status.STATUS_CODE_BAD_REQUEST
    );
  },

  /**
   * Handle and format authentication errors
   * @param {Error} error - Authentication error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleAuthenticationError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Authentication error in ${module}:`, error);
    return buildErrorResponse(
      error.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
      status.STATUS_CODE_UNAUTHORIZED
    );
  },

  /**
   * Handle and format authorization errors
   * @param {Error} error - Authorization error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleAuthorizationError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Authorization error in ${module}:`, error);
    return buildErrorResponse(
      error.message || ERROR_MESSAGES.UNAUTHORIZED,
      status.STATUS_CODE_FORBIDDEN
    );
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
    return buildErrorResponse(
      `${resource} not found`,
      status.STATUS_CODE_NOT_FOUND
    );
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
    return buildErrorResponse(
      `${resource} with this ${field} already exists`,
      status.STATUS_CODE_CONFLICT
    );
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
    return buildErrorResponse(
      `${referencedResource} not found for the given ${foreignKeyField}`,
      status.STATUS_CODE_BAD_REQUEST
    );
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
    return buildErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      status.STATUS_CODE_INTERNAL_SERVER_STATUS
    );
  },

  /**
   * Handle and format general internal server errors
   * @param {Error} error - General error
   * @param {string} module - Module name where error occurred
   * @returns {Object} Formatted error response with status code
   */
  handleInternalServerError(error, module = ERROR_CLASS_NAMES.UNKNOWN_MODULE) {
    logger.error(`Internal server error in ${module}:`, error);
    return buildErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      status.STATUS_CODE_INTERNAL_SERVER_STATUS
    );
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

    switch (true) {
      case error.code === ERROR_CODES.DUPLICATE_ERROR:
        return buildErrorResponse(
          error.message || ERROR_DEFAULT_MESSAGES.RESOURCE_ALREADY_EXISTS,
          status.STATUS_CODE_CONFLICT
        );
      case error.code === ERROR_CODES.FOREIGN_KEY_ERROR:
        return buildErrorResponse(
          error.message || ERROR_DEFAULT_MESSAGES.INVALID_FOREIGN_KEY,
          status.STATUS_CODE_BAD_REQUEST
        );
      case error.name === ERROR_CLASS_NAMES.VALIDATION_ERROR ||
        error.name === ERROR_CLASS_NAMES.SEQUELIZE_VALIDATION_ERROR:
        return this.handleValidationError(error, module);
      case error.name === ERROR_CLASS_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR:
        return this.handleDuplicateError(
          module,
          error.fields?.[0] || "field",
          module
        );
      case error.name ===
        ERROR_CLASS_NAMES.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR:
        return this.handleForeignKeyError(
          error.fields?.[0] || "foreign_key",
          "referenced record",
          module
        );
      case error.name === ERROR_CLASS_NAMES.SEQUELIZE_DATABASE_ERROR:
        return this.handleDatabaseError(error, operation, module);
      case error.name === ERROR_CLASS_NAMES.UNAUTHORIZED_ERROR ||
        (typeof error.message === "string" &&
          error.message.includes("unauthorized")):
        return this.handleAuthenticationError(error, module);
      case error.name === ERROR_CLASS_NAMES.FORBIDDEN_ERROR ||
        (typeof error.message === "string" &&
          error.message.includes("forbidden")):
        return this.handleAuthorizationError(error, module);
      case error.name === ERROR_CLASS_NAMES.NOT_FOUND_ERROR ||
        (typeof error.message === "string" &&
          error.message.includes("not found")):
        return this.handleNotFoundError(
          ERROR_DEFAULT_MESSAGES.RESOURCE,
          module
        );
      default:
        return this.handleInternalServerError(error, module);
    }
  },
};

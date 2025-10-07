import * as status from './status_code.utils.js';
import { successResponse, errorResponse } from './response.util.js';
import { ERROR_MESSAGES } from './constants/error.constants.js';
import { QUICKBOOKS_REPORTS_LOGS } from './constants/log.constants.js';
import logger from '../../config/logger.config.js';

/**
 * Error handling utilities for reports
 */
export class ReportsErrorHandler {
  /**
   * Handle API errors with proper status codes and logging
   * @param {Error} error - The error object
   * @param {Object} res - Express response object
   * @param {string} reportType - Type of report
   * @param {string} realmId - Realm ID
   * @param {string} operation - Operation being performed
   * @returns {Object} Error response
   */
  static handleApiError(error, res, reportType, realmId, operation = 'processing') {
    try {
      const errorMessage = error?.message || "Unknown error occurred";
      const errorStatus = error?.response?.status || error?.status;
      const isDatabaseError = error?.name === 'SequelizeDatabaseError';
      
      // Log error with context
      logger.error(QUICKBOOKS_REPORTS_LOGS.API_REQUEST_FAILED(
        reportType,
        errorMessage,
        errorStatus
      ), {
        reportType,
        error: errorMessage,
        realmId,
        status: errorStatus,
        operation,
        isDatabaseError,
        originalError: error,
      });

      // Map error to appropriate response
      let mappedErrorMessage;
      let statusCode = status.STATUS_CODE_INTERNAL_SERVER_ERROR;

      if (isDatabaseError) {
        mappedErrorMessage = ERROR_MESSAGES.DATABASE.OPERATION_FAILED;
        statusCode = status.STATUS_CODE_INTERNAL_SERVER_ERROR;
      } else if (errorStatus === status.STATUS_CODE_UNAUTHORIZED) {
        mappedErrorMessage = ERROR_MESSAGES.AUTH.TOKEN_EXPIRED;
        statusCode = status.STATUS_CODE_UNAUTHORIZED;
      } else if (errorStatus === status.STATUS_CODE_FORBIDDEN) {
        mappedErrorMessage = ERROR_MESSAGES.AUTH.ACCESS_DENIED;
        statusCode = status.STATUS_CODE_FORBIDDEN;
      } else if (errorStatus === status.STATUS_CODE_NOT_FOUND) {
        mappedErrorMessage = ERROR_MESSAGES.REPORTS.COMPANY_NOT_FOUND;
        statusCode = status.STATUS_CODE_NOT_FOUND;
      } else {
        mappedErrorMessage = ERROR_MESSAGES.GENERIC.PROCESSING_FAILED(
          `${reportType} report ${operation}`
        );
      }

      return res.status(statusCode).json(errorResponse(mappedErrorMessage));
    } catch (err) {
      logger.error('Error in ReportsErrorHandler.handleApiError:', {
        error: err.message,
        stack: err.stack,
        originalError: error,
        reportType,
        realmId,
        operation,
      });
      return res
        .status(status.STATUS_CODE_INTERNAL_SERVER_ERROR)
        .json(errorResponse(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Handle validation errors
   * @param {Object} res - Express response object
   * @param {string} field - Field that failed validation
   * @param {string} reportType - Type of report
   * @returns {Object} Error response
   */
  static handleValidationError(res, field, reportType) {
    logger.warn(QUICKBOOKS_REPORTS_LOGS.VALIDATION_FAILED(field, reportType), {
      field,
      reportType
    });
    
    return res
      .status(status.STATUS_CODE_BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD.replace("{field}", field)));
  }
}

/**
 * Response utilities for reports
 */
export class ReportsResponseHandler {
  /**
   * Send success response for report processing
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @returns {Object} Success response
   */
  static sendSuccess(res, message, data) {
    logger.info(QUICKBOOKS_REPORTS_LOGS.PROCESSING_SUCCESS, {
      reportType: data.reportType,
      reportId: data.reportId,
      columnsCount: data.columnsCount,
      rowsCount: data.rowsCount
    });

    return res.status(status.STATUS_CODE_SUCCESS).json(successResponse(message, data));
  }

  /**
   * Send error response for report processing
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Error response
   */
  static sendError(res, message, statusCode = status.STATUS_CODE_INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json(errorResponse(message));
  }
}

/**
 * Validation utilities for reports
 */
export class ReportsValidator {
  /**
   * Validate required fields for report requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} reportType - Type of report
   * @param {boolean} requireDates - Whether dates are required
   * @returns {boolean} Validation result
   */
  static validateRequiredFields(req, res, reportType, requireDates = true) {
    try {
      const { realmId, quickBookAccesstoken, startDate, endDate } = req.body;

      // Validate realmId
      if (!realmId) {
        ReportsErrorHandler.handleValidationError(res, 'realmId', reportType);
        return false;
      }

      // Validate access token
      if (!quickBookAccesstoken) {
        ReportsErrorHandler.handleValidationError(res, 'quickBookAccesstoken', reportType);
        return false;
      }

      // Validate dates if required
      if (requireDates && (!startDate || !endDate)) {
        ReportsErrorHandler.handleValidationError(res, 'startDate, endDate', reportType);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error in ReportsValidator.validateRequiredFields:', {
        error: error.message,
        stack: error.stack,
        reportType,
        requireDates,
      });
      ReportsErrorHandler.handleApiError(error, res, reportType, null, 'validation');
      return false;
    }
  }
}

export default {
  ReportsErrorHandler,
  ReportsResponseHandler,
  ReportsValidator
};

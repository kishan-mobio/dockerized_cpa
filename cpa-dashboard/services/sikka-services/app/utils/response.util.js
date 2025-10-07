/**
 * Success response utility
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @returns {Object} Formatted success response
 */
export const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Error response utility
 * @param {string} message - Error message
 * @param {any} errors - Error details
 * @returns {Object} Formatted error response
 */
export const errorResponse = (message, errors = null) => {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

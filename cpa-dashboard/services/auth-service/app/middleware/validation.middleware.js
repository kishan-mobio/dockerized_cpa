import { validationResult } from 'express-validator';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { VALIDATION_MESSAGES } from '../utils/constants/validation.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';


const logger = createLogger(LOGGER_NAMES.VALIDATION_MIDDLEWARE);

/**
 * Express-validator middleware
 * Validates requests using express-validator chains
 * @param {Array} validations - Array of validation chains
 * @returns {Function} - Middleware function to validate requests and handle errors
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      
      if (errors.isEmpty()) {
        return next();
      }

      logger.warn(HARDCODED_STRINGS.VALIDATION_LOG_MESSAGES.EXPRESS_VALIDATION_FAILED, {
        endpoint: req.originalUrl,
        method: req.method,
        errors: errors.array()
      });

      res.status(400).json({
        success: false,
        message: VALIDATION_MESSAGES.VALIDATION_FAILED,
        errors: errors.array()
      });
    } catch (error) {
      logger.error(HARDCODED_STRINGS.VALIDATION_LOG_MESSAGES.EXPRESS_VALIDATION_ERROR, {
        endpoint: req.originalUrl,
        method: req.method,
        error: error.message
      });

      res.status(500).json({
        success: false,
        message: HARDCODED_STRINGS.VALIDATION_LOG_MESSAGES.VALIDATION_PROCESSING_ERROR
      });
    }
  };
};

export default { validate };

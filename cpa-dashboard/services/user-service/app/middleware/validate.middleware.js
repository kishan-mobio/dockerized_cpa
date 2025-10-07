import { validationResult } from "express-validator";
import { createLogger } from "../utils/logger.util.js";
import * as status from "../utils/status_code.util.js";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
  VALIDATION_DEFAULTS,
  LOGGER_COMPONENT_NAMES,
  VALIDATION_ERROR_TYPES,
} from "../utils/constants.util.js";
import { errorResponse } from "../utils/response.util.js";

const logger = createLogger(LOGGER_COMPONENT_NAMES.VALIDATION_MIDDLEWARE);

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

      logger.warn(VALIDATION_MESSAGES.EXPRESS_VALIDATION_FAILED + ":", {
        endpoint: req.originalUrl,
        method: req.method,
        errors: errors.array(),
      });

      res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(
          errorResponse(VALIDATION_MESSAGES.VALIDATION_FAILED, errors.array())
        );
    } catch (error) {
      logger.error(VALIDATION_MESSAGES.EXPRESS_VALIDATION_ERROR + ":", {
        endpoint: req.originalUrl,
        method: req.method,
        error: error.message,
      });

      res
        .status(status.STATUS_CODE_INTERNAL_SERVER_STATUS)
        .json(errorResponse(VALIDATION_MESSAGES.VALIDATION_PROCESSING_ERROR));
    }
  };
};

/**
 * Enhanced Joi validation middleware with comprehensive error handling and caching
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Source of data to validate (body, query, params)
 * @param {Object} options - Additional validation options
 * @returns {Function} - Middleware function to validate requests and handle errors
 */
export const validateJoi = (
  schema,
  source = VALIDATION_DEFAULTS.DEFAULT_SOURCE,
  options = {}
) => {
  // Cache compiled schema for better performance
  const compiledSchema = schema.compile ? schema.compile() : schema;

  const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    ...options,
  };

  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const { error, value } = compiledSchema.validate(
        dataToValidate,
        defaultOptions
      );

      if (error) {
        const validationErrors = error.details.map((detail) => ({
          field: detail.path.join(VALIDATION_DEFAULTS.JOIN_SEPARATOR),
          message: detail.message.replace(
            /"/g,
            VALIDATION_DEFAULTS.QUOTE_REPLACEMENT
          ),
          value: detail.context?.value,
          type: detail.type,
        }));

        logger.warn(VALIDATION_MESSAGES.JOI_VALIDATION_FAILED + ":", {
          endpoint: req.originalUrl,
          method: req.method,
          userAgent: req.get(VALIDATION_DEFAULTS.USER_AGENT_HEADER),
          ip: req.ip,
          errors: validationErrors,
          source,
        });

        return res
          .status(status.STATUS_CODE_BAD_REQUEST)
          .json(
            errorResponse(
              VALIDATION_MESSAGES.VALIDATION_FAILED_FOR_SOURCE.replace(
                "{source}",
                source
              ),
              validationErrors
            )
          );
      }

      // Attach validated and sanitized data to request
      req[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] =
        value;
      next();
    } catch (err) {
      logger.error(VALIDATION_MESSAGES.JOI_VALIDATION_MIDDLEWARE_ERROR + ":", {
        endpoint: req.originalUrl,
        method: req.method,
        error: err.message,
        stack: err.stack,
        source,
      });

      return res
        .status(status.STATUS_CODE_INTERNAL_SERVER_STATUS)
        .json(
          errorResponse(
            VALIDATION_MESSAGES.VALIDATION_PROCESSING_ERROR,
            process.env.NODE_ENV === VALIDATION_DEFAULTS.DEVELOPMENT_MODE
              ? err.message
              : ERROR_MESSAGES.INTERNAL_ERROR
          )
        );
    }
  };
};

/**
 * Multi-source validation middleware with enhanced error handling
 * @param {Object} schemas - Object containing validation schemas for different sources
 * @param {Object} options - Global validation options
 * @returns {Function} - Middleware function
 */
export const validateMultiple = (schemas, options = {}) => {
  // Pre-compile schemas for better performance
  const compiledSchemas = Object.entries(schemas).reduce(
    (acc, [source, schema]) => {
      acc[source] = schema.compile ? schema.compile() : schema;
      return acc;
    },
    {}
  );

  const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    ...options,
  };

  return async (req, res, next) => {
    try {
      const validationErrors = [];
      const validatedData = {};

      // Process all schemas in parallel for better performance
      const validationPromises = Object.entries(compiledSchemas).map(
        async ([source, schema]) => {
          const { error, value } = schema.validate(req[source], defaultOptions);
          if (error) {
            const sourceErrors = error.details.map((detail) => ({
              source,
              field: detail.path.join(VALIDATION_DEFAULTS.JOIN_SEPARATOR),
              message: detail.message.replace(
                /"/g,
                VALIDATION_DEFAULTS.QUOTE_REPLACEMENT
              ),
              value: detail.context?.value,
              type: detail.type,
            }));
            validationErrors.push(...sourceErrors);
          } else {
            validatedData[source] = value;
          }
        }
      );

      await Promise.all(validationPromises);

      if (validationErrors.length > 0) {
        logger.warn(VALIDATION_MESSAGES.MULTI_SOURCE_VALIDATION_FAILED + ":", {
          endpoint: req.originalUrl,
          method: req.method,
          userAgent: req.get(VALIDATION_DEFAULTS.USER_AGENT_HEADER),
          ip: req.ip,
          errors: validationErrors,
        });

        return res
          .status(status.STATUS_CODE_BAD_REQUEST)
          .json(
            errorResponse(
              VALIDATION_MESSAGES.VALIDATION_FAILED,
              validationErrors
            )
          );
      }

      // Attach all validated data to request
      Object.entries(validatedData).forEach(([source, data]) => {
        req[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] =
          data;
      });

      next();
    } catch (err) {
      logger.error(VALIDATION_MESSAGES.MULTI_SOURCE_VALIDATION_ERROR + ":", {
        endpoint: req.originalUrl,
        method: req.method,
        error: err.message,
        stack: err.stack,
      });

      return res
        .status(status.STATUS_CODE_INTERNAL_SERVER_STATUS)
        .json(
          errorResponse(
            VALIDATION_MESSAGES.VALIDATION_PROCESSING_ERROR,
            process.env.NODE_ENV === VALIDATION_DEFAULTS.DEVELOPMENT_MODE
              ? err.message
              : ERROR_MESSAGES.INTERNAL_ERROR
          )
        );
    }
  };
};

/**
 * Conditional validation middleware
 * Only validates if the condition is met
 * @param {Function} condition - Function that returns boolean
 * @param {Function} validator - Validation middleware to apply
 * @returns {Function} - Conditional validation middleware
 */
export const validateIf = (condition, validator) => {
  return (req, res, next) => {
    if (condition(req, res)) {
      return validator(req, res, next);
    }
    next();
  };
};

/**
 * Async validation middleware
 * Allows for async validation operations
 * @param {Function} validator - Async validation function
 * @returns {Function} - Async validation middleware
 */
export const validateAsync = (validator) => {
  return async (req, res, next) => {
    try {
      const result = await validator(req, res);
      if (result && result.isValid === false) {
        return res
          .status(status.STATUS_CODE_BAD_REQUEST)
          .json(
            errorResponse(
              result.message || VALIDATION_MESSAGES.VALIDATION_FAILED,
              result.errors
            )
          );
      }
      next();
    } catch (error) {
      logger.error(VALIDATION_MESSAGES.ASYNC_VALIDATION_ERROR + ":", {
        endpoint: req.originalUrl,
        method: req.method,
        error: error.message,
      });

      res
        .status(status.STATUS_CODE_INTERNAL_SERVER_STATUS)
        .json(errorResponse(VALIDATION_MESSAGES.VALIDATION_PROCESSING_ERROR));
    }
  };
};

/**
 * Validation result formatter
 * Formats validation errors for consistent response structure
 * @param {Array} errors - Raw validation errors
 * @returns {Object} - Formatted validation response
 */
export const formatValidationErrors = (errors) => {
  return {
    success: false,
    message: VALIDATION_MESSAGES.VALIDATION_FAILED,
    errors: errors.map((err) => ({
      field: err.field || err.path || err.param,
      message: err.message,
      value: err.value,
      type: err.type || VALIDATION_ERROR_TYPES.VALIDATION_ERROR,
    })),
  };
};

export default {
  // Express validation
  validate,

  // Joi validation
  validateJoi,
  validateMultiple,

  // Advanced validation
  validateIf,
  validateAsync,

  // Utilities
  formatValidationErrors,
};

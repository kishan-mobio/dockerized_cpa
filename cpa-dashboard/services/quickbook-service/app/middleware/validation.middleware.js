import { validationResult } from 'express-validator';
import { createLogger } from '../utils/logger.utils.js';
import { errorResponse } from '../utils/response.util.js';
import { ERROR_MESSAGES } from '../utils/constants/error.constants.js';
import { QUICKBOOKS_VALIDATION_ERROR_MESSAGES } from '../utils/constants/error.constants.js';
import { QUICKBOOKS_LOGGER_NAMES } from '../utils/constants/config.constants.js';
import { QUICKBOOKS_VALIDATION_LOGS } from '../utils/constants/log.constants.js';
import { 
  STATUS_CODE_BAD_REQUEST, 
  STATUS_CODE_INTERNAL_SERVER_ERROR 
} from '../utils/status_code.utils.js';

const logger = createLogger(QUICKBOOKS_LOGGER_NAMES.VALIDATION_MIDDLEWARE);

export const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      
      if (errors.isEmpty()) {
        return next();
      }

      logger.warn(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.EXPRESS_VALIDATION_FAILED, {
        endpoint: req.originalUrl,
        method: req.method,
        errors: errors.array()
      });

      res.status(STATUS_CODE_BAD_REQUEST).json(
        errorResponse(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED, errors.array())
      );
    } catch (error) {
      logger.error(QUICKBOOKS_VALIDATION_LOGS.VALIDATE_REQUIRED_FIELDS_ERROR, {
        error: error.message,
        stack: error.stack,
        endpoint: req.originalUrl,
        method: req.method
      });

      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).json(
        errorResponse(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_PROCESSING_ERROR)
      );
    }
  };
};

export const validateJoi = (schema, source = QUICKBOOKS_VALIDATION_ERROR_MESSAGES.DEFAULT_SOURCE, options = {}) => {
  const compiledSchema = schema.compile ? schema.compile() : schema;
  
  const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    ...options
  };

  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const { error, value } = compiledSchema.validate(dataToValidate, defaultOptions);
      
      if (error) {
        const validationErrors = error.details.map(detail => ({
          field: detail.path.join(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.JOIN_SEPARATOR),
          message: detail.message.replace(/"/g, QUICKBOOKS_VALIDATION_ERROR_MESSAGES.QUOTE_REPLACEMENT),
          value: detail.context?.value,
          type: detail.type
        }));

        logger.warn(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.JOI_VALIDATION_FAILED, {
          endpoint: req.originalUrl,
          method: req.method,
          userAgent: req.get(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.USER_AGENT_HEADER),
          ip: req.ip,
          errors: validationErrors,
          source
        });
        
        return res.status(STATUS_CODE_BAD_REQUEST).json(
          errorResponse(
            QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED_FOR_SOURCE(source),
            validationErrors
          )
        );
      }

      req[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] = value;
      next();
    } catch (err) {
      logger.error(QUICKBOOKS_VALIDATION_LOGS.VALIDATE_REQUIRED_FIELDS_ERROR, {
        error: err.message,
        stack: err.stack,
        endpoint: req.originalUrl,
        method: req.method,
        source: source
      });
      
      return res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).json(
        errorResponse(
          QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_PROCESSING_ERROR,
          process.env.NODE_ENV === QUICKBOOKS_VALIDATION_ERROR_MESSAGES.DEVELOPMENT_MODE ? err.message : ERROR_MESSAGES.INTERNAL_ERROR
        )
      );
    }
  };
};

export const validateMultiple = (schemas, options = {}) => {
  const compiledSchemas = Object.entries(schemas).reduce((acc, [source, schema]) => {
    acc[source] = schema.compile ? schema.compile() : schema;
    return acc;
  }, {});

  const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    ...options
  };

  return async (req, res, next) => {
    try {
      const validationErrors = [];
      const validatedData = {};

      const validationPromises = Object.entries(compiledSchemas).map(async ([source, schema]) => {
        const { error, value } = schema.validate(req[source], defaultOptions);
        if (error) {
          const sourceErrors = error.details.map(detail => ({
            source,
            field: detail.path.join(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.JOIN_SEPARATOR),
            message: detail.message.replace(/"/g, QUICKBOOKS_VALIDATION_ERROR_MESSAGES.QUOTE_REPLACEMENT),
            value: detail.context?.value,
            type: detail.type
          }));
          validationErrors.push(...sourceErrors);
        } else {
          validatedData[source] = value;
        }
      });

      await Promise.all(validationPromises);

      if (validationErrors.length > 0) {
        logger.warn(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.MULTI_SOURCE_VALIDATION_FAILED, {
          endpoint: req.originalUrl,
          method: req.method,
          userAgent: req.get(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.USER_AGENT_HEADER),
          ip: req.ip,
          errors: validationErrors
        });
        
        return res.status(STATUS_CODE_BAD_REQUEST).json(
          errorResponse(
            QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED,
            validationErrors
          )
        );
      }

      Object.entries(validatedData).forEach(([source, data]) => {
        req[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] = data;
      });

      next();
    } catch (err) {
      logger.error(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.MULTI_SOURCE_VALIDATION_ERROR, {
        endpoint: req.originalUrl,
        method: req.method,
        error: err.message,
        stack: err.stack
      });
      
      return res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).json(
        errorResponse(
          QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_PROCESSING_ERROR,
          process.env.NODE_ENV === QUICKBOOKS_VALIDATION_ERROR_MESSAGES.DEVELOPMENT_MODE ? err.message : ERROR_MESSAGES.INTERNAL_ERROR
        )
      );
    }
  };
};

export const validateIf = (condition, validator) => {
  return (req, res, next) => {
    if (condition(req, res)) {
      return validator(req, res, next);
    }
    next();
  };
};

export const validateAsync = (validator) => {
  return async (req, res, next) => {
    try {
      const result = await validator(req, res);
      if (result && result.isValid === false) {
        return res.status(STATUS_CODE_BAD_REQUEST).json(
          errorResponse(result.message ? result.message : QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED, result.errors)
        );
      }
      next();
    } catch (error) {
      logger.error(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.ASYNC_VALIDATION_ERROR, {
        endpoint: req.originalUrl,
        method: req.method,
        error: error.message
      });

      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).json(
        errorResponse(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_PROCESSING_ERROR)
      );
    }
  };
};

export const sanitize = (sanitizers) => {
  return (req, res, next) => {
    try {
      Object.entries(sanitizers).forEach(([source, sanitizer]) => {
        if (req[source] && typeof sanitizer === 'function') {
          req[source] = sanitizer(req[source]);
        }
      });
      next();
    } catch (error) {
      logger.error(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.SANITIZATION_ERROR, {
        endpoint: req.originalUrl,
        method: req.method,
        error: error.message
      });

      res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).json(
        errorResponse(QUICKBOOKS_VALIDATION_ERROR_MESSAGES.DATA_SANITIZATION_ERROR)
      );
    }
  };
};

export const formatValidationErrors = (errors) => {
  return {
    success: false,
    message: QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED,
    errors: errors.map(err => ({
      field: err.field ? err.field : err.path ? err.path : err.param,
      message: err.message,
      value: err.value,
      type: err.type ? err.type : QUICKBOOKS_VALIDATION_ERROR_MESSAGES.VALIDATION_ERROR_TYPE
    }))
  };
};

export default {
  validate,
  
  validateJoi,
  validateMultiple,
  
  validateIf,
  validateAsync,
  
  sanitize,
  formatValidationErrors
};
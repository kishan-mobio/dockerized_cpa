import winston from 'winston';
import { ENV_TYPES } from './constants/config.constants.js';
import { LOG_LEVELS, LOG_FORMATS } from './constants/log.constants.js';

/**
 * Logger configuration constants
 */
const LOGGER_CONFIG = {
  DEFAULT_LEVEL: LOG_LEVELS.INFO,
  DEFAULT_FORMAT: LOG_FORMATS.COMBINED,
  MAX_FILES: 5,
  MAX_SIZE: '20m',
  DATE_PATTERN: 'YYYY-MM-DD',
  LOG_DIR: './logs',
  NANOSECONDS_TO_MILLISECONDS: 1000000,
};

/**
 * Creates a logger instance with the specified context
 * @param {string} context - The context/name of the logger
 * @param {Object} options - Additional logger options
 * @returns {winston.Logger} Winston logger instance
 */
export const createLogger = (context, options = {}) => {
  const {
    level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : LOGGER_CONFIG.DEFAULT_LEVEL,
    enableFileLogging = process.env.NODE_ENV !== ENV_TYPES.DEVELOPMENT,
    logDir = LOGGER_CONFIG.LOG_DIR,
  } = options;

  const logger = winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { 
      context,
      service: 'cpa-dashboard-api',
      version: process.env.npm_package_version ? process.env.npm_package_version : '1.0.0'
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            return `${timestamp} [${context}] ${level}: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          })
        ),
      }),
    ],
    // Handle uncaught exceptions and unhandled rejections
    exceptionHandlers: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ],
    rejectionHandlers: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  // Add file logging in production
  if (enableFileLogging) {
    try {
      // Error log file
      logger.add(new winston.transports.File({
        filename: `${logDir}/error.log`,
        level: LOG_LEVELS.ERROR,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: LOGGER_CONFIG.MAX_SIZE,
        maxFiles: LOGGER_CONFIG.MAX_FILES,
      }));

      // Combined log file
      logger.add(new winston.transports.File({
        filename: `${logDir}/combined.log`,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: LOGGER_CONFIG.MAX_SIZE,
        maxFiles: LOGGER_CONFIG.MAX_FILES,
      }));

      // Daily rotate file for better log management
      if (process.env.NODE_ENV === ENV_TYPES.PRODUCTION) {
        const _DailyRotateFile = require('winston-daily-rotate-file');
        
        logger.add(new winston.transports.DailyRotateFile({
          filename: `${logDir}/application-%DATE%.log`,
          datePattern: LOGGER_CONFIG.DATE_PATTERN,
          zippedArchive: true,
          maxSize: LOGGER_CONFIG.MAX_SIZE,
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }));
      }
    } catch (error) {
      // Fallback to console if file logging fails
      logger.warn('Failed to setup file logging, falling back to console only', { error: error.message });
    }
  }

  return logger;
};

/**
 * Creates a child logger with additional context
 * @param {winston.Logger} parentLogger - Parent logger instance
 * @param {string} childContext - Child context name
 * @param {Object} meta - Additional metadata
 * @returns {winston.Logger} Child logger instance
 */
export const createChildLogger = (parentLogger, childContext, meta = {}) => {
  return parentLogger.child({
    context: childContext,
    ...meta
  });
};

/**
 * Creates a request logger for Express middleware
 * @param {string} context - Logger context
 * @returns {Function} Express middleware function
 */
export const createRequestLogger = (context = LOGGER_CONTEXTS.REQUEST) => {
  const logger = createLogger(context);
  
  return (req, res, next) => {
    const start = Date.now();
    
    // Log request
    logger.info('Request received', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const duration = Date.now() - start;
      
      logger.info('Request completed', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });

      originalEnd.call(this, chunk, encoding);
    };

    next();
  };
};

/**
 * Creates a performance logger for timing operations
 * @param {string} context - Logger context
 * @returns {Object} Performance logger with timing methods
 */
export const createPerformanceLogger = (context = LOGGER_CONTEXTS.PERFORMANCE) => {
  const logger = createLogger(context);
  
  return {
    /**
     * Start timing an operation
     * @param {string} operation - Operation name
     * @returns {Function} End timing function
     */
    startTimer: (operation) => {
      const start = process.hrtime.bigint();
      
      return (metadata = {}) => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / LOGGER_CONFIG.NANOSECONDS_TO_MILLISECONDS; // Convert to milliseconds
        
        logger.info('Operation completed', {
          operation,
          duration: `${duration.toFixed(2)}ms`,
          ...metadata
        });
      };
    },

    /**
     * Log a performance metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     * @param {string} unit - Metric unit
     * @param {Object} metadata - Additional metadata
     */
    logMetric: (metric, value, unit = 'ms', metadata = {}) => {
      logger.info('Performance metric', {
        metric,
        value,
        unit,
        ...metadata
      });
    }
  };
};

// Export a default logger instance
export default createLogger('cpa-dashboard-api');

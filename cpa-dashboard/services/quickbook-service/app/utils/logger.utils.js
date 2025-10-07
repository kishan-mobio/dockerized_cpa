import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ENV_TYPES } from './constants/config.constants.js';
import { LOG_LEVELS, LOG_FORMATS } from './constants/messages.constants.js';

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
      service: 'cpa-dashboard-quickbooks-service',
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
        logger.add(new DailyRotateFile({
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


// Export a default logger instance
export default createLogger('cpa-dashboard-quickbooks-service');

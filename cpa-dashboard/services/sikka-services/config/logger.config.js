import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { CONFIG_DEFAULTS, DATE_FORMATS } from '../app/utils/constants.util.js';

/**
 * Logger Configuration for Sikka Service
 * Centralized logging configuration with multiple transports
 */

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      context,
      message,
      ...meta,
    });
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
  winston.format.printf(({ timestamp, level, message, context }) => {
    return `${timestamp} [${context || 'SikkaService'}] ${level}: ${message}`;
  })
);

// Create transports array
const createTransports = () => {
  const transports = [
    // Console transport
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || CONFIG_DEFAULTS.LOG_LEVEL,
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true,
    }),
  ];

  // File transports (only in production or when LOG_TO_FILE is enabled)
  if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
    // All logs file
    transports.push(
      new DailyRotateFile({
        filename: `${CONFIG_DEFAULTS.LOG_DIRECTORY}/sikka-service-%DATE%.log`,
        datePattern: CONFIG_DEFAULTS.LOG_DATE_PATTERN,
        maxSize: CONFIG_DEFAULTS.LOG_MAX_SIZE,
        maxFiles: CONFIG_DEFAULTS.LOG_MAX_FILES,
        zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
        level: CONFIG_DEFAULTS.LOG_INFO_LEVEL,
        format: logFormat,
        handleExceptions: true,
        handleRejections: true,
      })
    );

    // Error logs file
    transports.push(
      new DailyRotateFile({
        filename: `${CONFIG_DEFAULTS.LOG_DIRECTORY}/sikka-service-error-%DATE%.log`,
        datePattern: CONFIG_DEFAULTS.LOG_DATE_PATTERN,
        maxSize: CONFIG_DEFAULTS.LOG_MAX_SIZE,
        maxFiles: CONFIG_DEFAULTS.LOG_MAX_FILES,
        zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
        level: CONFIG_DEFAULTS.LOG_ERROR_LEVEL,
        format: logFormat,
        handleExceptions: true,
        handleRejections: true,
      })
    );

    // API logs file (for API-specific logging)
    transports.push(
      new DailyRotateFile({
        filename: `${CONFIG_DEFAULTS.LOG_DIRECTORY}/sikka-api-%DATE%.log`,
        datePattern: CONFIG_DEFAULTS.LOG_DATE_PATTERN,
        maxSize: CONFIG_DEFAULTS.LOG_MAX_SIZE,
        maxFiles: CONFIG_DEFAULTS.LOG_MAX_FILES,
        zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
        level: 'info',
        format: logFormat,
        handleExceptions: false,
        handleRejections: false,
      })
    );
  }

  return transports;
};

// Logger configuration object
export const loggerConfig = {
  level: process.env.LOG_LEVEL || CONFIG_DEFAULTS.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { 
    service: 'sikka-service',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: createTransports(),
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test',
};

// Create the main logger instance
export const mainLogger = winston.createLogger(loggerConfig);

// Handle uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV !== 'test') {
  process.on('uncaughtException', (error) => {
    mainLogger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    mainLogger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

// Export logger creation function
export const createContextLogger = (context) => {
  return winston.createLogger({
    ...loggerConfig,
    defaultMeta: {
      ...loggerConfig.defaultMeta,
      context,
    },
  });
};

// Export specific loggers for different components
export const apiLogger = createContextLogger('API');
export const dbLogger = createContextLogger('DATABASE');
export const sikkaApiLogger = createContextLogger('SIKKA_API');
export const authLogger = createContextLogger('AUTH');
export const errorLogger = createContextLogger('ERROR');

export default mainLogger;

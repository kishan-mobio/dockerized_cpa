
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  DATE_FORMATS,
  CONFIG_DEFAULTS,
} from "../app/utils/constants/config.constants.js";
import { LOGGER_NAMES } from "../app/utils/constants/log.constants.js";

import { getLoggingConfig } from "./shared.config.js";


const { combine, timestamp, json, printf, colorize } = winston.format;

// Get logging configuration from shared utilities
const loggingConfig = getLoggingConfig();



/**
 * Custom format for console output with colors
 */
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length
    ? JSON.stringify(metadata, null, 2)
    : "";
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

/**
 * Create a rotating file transport with specified options
 */
const createDailyRotateFileTransport = (
  type,
  level = CONFIG_DEFAULTS.LOG_INFO_LEVEL
) => {
  return new DailyRotateFile({
    filename: `${loggingConfig.filePath}/${type}-%DATE%.log`,
    datePattern: DATE_FORMATS.DATE_PATTERN,
    level,
    zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
    maxSize: loggingConfig.maxSize,
    maxFiles: `${loggingConfig.maxFiles}d`,

    format: combine(timestamp({ format: DATE_FORMATS.LOG_FORMAT }), json()),
    format: combine(
      timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
      json()
    )

  });
};

/**
 * Configure and create Winston logger instance
 */
const logger = winston.createLogger({
  level: loggingConfig.level,
  defaultMeta: { service: LOGGER_NAMES.SERVICE_NAMES.AUTH_SERVICE },
  transports: [
    // Application logs
    createDailyRotateFileTransport(LOGGER_NAMES.LOG_FILE_TYPES.APPLICATION),
    // Error logs

    createDailyRotateFileTransport(
      LOGGER_NAMES.LOG_FILE_TYPES.ERROR,
      CONFIG_DEFAULTS.LOG_ERROR_LEVEL
    ),
    // Console transport for development
    ...(loggingConfig.enableConsole
      ? [
          new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug",
            format: combine(
              colorize(),
              timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
              consoleFormat
            ),
          }),
        ]
      : []),
    createDailyRotateFileTransport(LOGGER_NAMES.LOG_FILE_TYPES.ERROR, CONFIG_DEFAULTS.LOG_ERROR_LEVEL),
    // Console transport for development
    ...(loggingConfig.enableConsole ? [new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
      format: combine(
        colorize(),
        timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
        consoleFormat
      )
    })] : [])

  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    createDailyRotateFileTransport(LOGGER_NAMES.LOG_FILE_TYPES.EXCEPTIONS),

    ...(loggingConfig.enableConsole
      ? [
          new winston.transports.Console({
            format: combine(
              colorize(),
              timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
              consoleFormat
            ),
          }),
        ]
      : []),
  ],
  rejectionHandlers: [
    createDailyRotateFileTransport(LOGGER_NAMES.LOG_FILE_TYPES.REJECTIONS),
    ...(loggingConfig.enableConsole
      ? [
          new winston.transports.Console({
            format: combine(
              colorize(),
              timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
              consoleFormat
            ),
          }),
        ]
      : []),
    ...(loggingConfig.enableConsole ? [new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
        consoleFormat
      )
    })] : [])
  ],
  rejectionHandlers: [
    createDailyRotateFileTransport(LOGGER_NAMES.LOG_FILE_TYPES.REJECTIONS),
    ...(loggingConfig.enableConsole ? [new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: DATE_FORMATS.LOG_FORMAT }),
        consoleFormat
      )
    })] : [])

  ],
  // Prevent process exit on handled exceptions
  exitOnError: false,
});

// Export a function that creates a child logger with context
export const createLogger = (context) => {
  return logger.child({ context });
};

export default logger;

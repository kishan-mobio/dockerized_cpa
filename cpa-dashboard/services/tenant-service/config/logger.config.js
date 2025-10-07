import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { CONFIG_DEFAULTS, DATE_FORMATS } from '../app/utils/constants.util.js';

const logDirectory = CONFIG_DEFAULTS.LOG_DIRECTORY;

const createDailyRotateFileTransport = (type, level = CONFIG_DEFAULTS.LOG_INFO_LEVEL) => {
  return new DailyRotateFile({
    filename: `${logDirectory}/${type}-%DATE%.log`,
    datePattern: DATE_FORMATS.DATE_PATTERN,
    level: level,
    zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
    maxSize: CONFIG_DEFAULTS.LOG_MAX_SIZE,
    maxFiles: `${CONFIG_DEFAULTS.LOG_MAX_FILES}d`,
  });
};

/**
 * Create a logger instance with the specified context
 * @param {string} context - The context/name of the logger
 * @returns {winston.Logger} Winston logger instance
 */
const logger = winston.createLogger({
  level: CONFIG_DEFAULTS.LOG_INFO_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({
      format: DATE_FORMATS.LOG_FORMAT,
    }),
    winston.format.json()
  ),
  transports: [
    createDailyRotateFileTransport('applications'),
    createDailyRotateFileTransport('error', CONFIG_DEFAULTS.LOG_ERROR_LEVEL),
    new winston.transports.Console(),
  ],
});

export default logger;

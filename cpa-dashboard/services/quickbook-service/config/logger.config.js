import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { DATE_FORMATS, CONFIG_DEFAULTS } from '../app/utils/constants/config.constants.js';
import { getLoggingConfig } from './shared.config.js';

const loggingConfig = getLoggingConfig();

const createDailyRotateFileTransport = (type, level = CONFIG_DEFAULTS.LOG_INFO_LEVEL) => {
  return new DailyRotateFile({
    filename: `${loggingConfig.filePath}/${type}-%DATE%.log`,
    datePattern: DATE_FORMATS.DATE_PATTERN,
    level: level,
    zippedArchive: CONFIG_DEFAULTS.LOG_ZIPPED_ARCHIVE,
    maxSize: loggingConfig.maxSize,
    maxFiles: `${loggingConfig.maxFiles}d`,
  });
};

const logger = winston.createLogger({
  level: loggingConfig.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: DATE_FORMATS.LOG_FORMAT,
    }),
    winston.format.json()
  ),
  transports: [
    createDailyRotateFileTransport('applications'),
    createDailyRotateFileTransport('error', CONFIG_DEFAULTS.LOG_ERROR_LEVEL),
    ...(loggingConfig.enableConsole ? [new winston.transports.Console()] : []),
  ],
});

export default logger;

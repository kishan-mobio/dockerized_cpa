import winston from "winston";

/**
 * Create logger instance
 * @param {string} label - Logger label
 * @returns {Object} Winston logger instance
 */
export const createLogger = (label) => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.label({ label }),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: "sikka-service" },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "logs/sikka-error.log",
        level: "error",
      }),
      new winston.transports.File({
        filename: "logs/sikka-combined.log",
      }),
    ],
  });
};

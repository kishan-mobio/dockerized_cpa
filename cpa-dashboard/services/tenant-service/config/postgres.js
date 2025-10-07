// config/aws-config.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { createLogger } from "../app/utils/logger.util.js";
import { LOG_DATABASE, LOGGER_NAMES } from "../app/utils/constants.util.js";

const logger = createLogger(LOGGER_NAMES.AWS_CONFIG);

dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

/**
 * Test database connection
 * @returns {Promise<Object>} Connection test result
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info(LOG_DATABASE.CONNECTED_TO_DATABASE);
    return {
      success: true,
      message: LOG_DATABASE.CONNECTED_TO_DATABASE,
    };
  } catch (error) {
    logger.error(LOG_DATABASE.CONNECTION_FAILED, error.message);
    return {
      success: false,
      message: LOG_DATABASE.CONNECTION_FAILED,
      error: error.message,
    };
  }
};

/**
 * Close database connection
 * @returns {Promise<Object>} Connection close result
 */
export const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info(LOG_DATABASE.DATABASE_CONNECTION_CLOSE_SUCCESS);
    return {
      success: true,
      message: LOG_DATABASE.DATABASE_CONNECTION_CLOSE_SUCCESS,
    };
  } catch (error) {
    logger.error(LOG_DATABASE.DATABASE_CONNECTION_CLOSE_ERROR, error.message);
    return {
      success: false,
      message: LOG_DATABASE.DATABASE_CONNECTION_CLOSE_ERROR,
      error: error.message,
    };
  }
};

/**
 * Get database connection status
 * @returns {Promise<Object>} Connection status
 */
export const getConnectionStatus = async () => {
  try {
    await sequelize.authenticate();
    return {
      connected: true,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
};

export default sequelize;

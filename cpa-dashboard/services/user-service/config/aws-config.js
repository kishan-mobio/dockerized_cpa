// config/aws-config.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { createLogger } from "../app/utils/logger.util.js";
import {
  LOG_ACTIONS,
  LOG_DATABASE,
  LOG_ERRORS,
  LOGGER_NAMES,
} from "../app/utils/constants.util.js";

const logger = createLogger(LOGGER_NAMES.AWS_CONFIG);

dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);
// Connection status tracking
let connectionStatus = {
  connected: false,
  lastCheck: null,
  retryCount: 0,
  databaseType: "postgres",
  host: process.env.DB_HOST,
};
/**
 * Test database connection
 * @returns {Promise<Object>} Connection test result
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully", sequelize.config);
    const [results] = await sequelize.query("SELECT version() as version");
    const version = results[0]?.version || "Unknown";
    // Update connection status
    connectionStatus.connected = true;
    connectionStatus.lastCheck = new Date();
    connectionStatus.retryCount = 0;
    return {
      success: true,
      message: LOG_DATABASE.CONNECTED_TO_DATABASE,
      version: version,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        dialect: "postgres",
      },
    };
  } catch (error) {
    // Update connection status
    connectionStatus.connected = false;
    connectionStatus.lastCheck = new Date();
    connectionStatus.retryCount += 1;
    return {
      success: false,
      error: error.message,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        dialect: process.env.DB_DIALECT,
      },
    };
  }
}
/**
 * Get current connection status
 * @returns {Object} Connection status object
 */
function getConnectionStatus() {
  return { ...connectionStatus };
}
/**
 * Health check for the database
 * @returns {Promise<Object>} Health check result
 */
async function healthCheck() {
  try {
    const connectionTest = await testConnection();
    return {
      database: connectionTest.success ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      status: connectionTest.success ? "healthy" : "unhealthy",
      connection: connectionTest,
    };
  } catch (error) {
    return {
      database: "error",
      timestamp: new Date().toISOString(),
      status: "error",
      connection: {
        success: false,
        error: error.message,
      },
    };
  }
}
/**
 * Close database connection
 * @returns {Promise<void>}
 */
async function closeConnection() {
  try {
    await sequelize.close();
    connectionStatus.connected = false;
    connectionStatus.lastCheck = new Date();
    logger.info(LOG_ACTIONS.DATABASE_CONNECTION_CLOSE_SUCCESS);
  } catch (error) {
    logger.error(LOG_ERRORS.CONNECTION_CLOSE_ERROR, error);
    throw error;
  }
}
// Sequelize CLI configuration
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false,
};
// Export for application use
export {
  testConnection,
  getConnectionStatus,
  healthCheck,
  closeConnection,
  config,
};

// Export sequelize instance as default for models
export default sequelize;

// Export configuration object for Sequelize CLI (if needed separately)
export const cliConfig = {
  development: config,
  test: config,
  production: config,
};

import express from "express";
import allRoutes from "./routes/index.js";
import sequelize, { testConnection } from "../config/aws-config.js";
import {
  LOG_ACTIONS,
  LOG_DATABASE,
  SERVER_MESSAGES,
  HTTP_ERROR_CODES,
} from "./utils/constants.util.js";
import logger from "../config/logger.config.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", allRoutes);

// Database initialization
const initializeDatabase = async () => {
  try {
    logger.info(LOG_DATABASE.INITIALIZE_DATABASE);

    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      throw new Error(LOG_DATABASE.CONNECTION_FAILED);
    }

    await sequelize.authenticate();
    logger.info(LOG_DATABASE.CONNECTED_TO_DATABASE);

    return true;
  } catch (error) {
    logger.error(LOG_DATABASE.DATABASE_ERROR, error.message);
    return false;
  }
};

// Start server function
export const startServer = async (PORT) => {
  try {
    logger.info(LOG_ACTIONS.SERVER_STARTED);

    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      logger.error(LOG_DATABASE.INITIALIZE_DATABASE_FAILED);
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      logger.info(`${SERVER_MESSAGES.SERVER_RUNNING} ${PORT}`);
      logger.info(`${SERVER_MESSAGES.ACCESS_URL}: http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === HTTP_ERROR_CODES.EADDRINUSE) {
        logger.error(`${SERVER_MESSAGES.PORT_IN_USE} ${PORT}`);
      } else {
        logger.error(LOG_ACTIONS.SERVER_ERROR, error.message);
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error(LOG_ACTIONS.SERVER_STARTUP_FAILED, error.message);
    process.exit(1);
  }
};

export default app;

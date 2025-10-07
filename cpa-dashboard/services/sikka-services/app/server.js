import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index.route.js";
import { createLogger } from "./utils/logger.util.js";
import {
  SERVER_CONSTANTS,
  SERVER_MESSAGES,
  REQUEST_CONFIG,
  LOG_DATABASE,
} from "./utils/constants.util.js";
import {
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
} from "./utils/status_code.util.js";
import { errorResponse } from "./utils/response.util.js";
import { sequelize } from "../app/models/index.model.js";
import { testConnection } from "../config/postgres.js";

// Load environment variables
dotenv.config();

const logger = createLogger(SERVER_CONSTANTS.SIKKA_SERVER_LABEL);

/**
 * Create Express application
 * @returns {Object} Express app instance
 */
const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        SERVER_CONSTANTS.DEFAULT_ALLOWED_ORIGIN,
      ],
      credentials: true,
    })
  );

  // Logging middleware
  app.use(morgan("combined"));

  // Body parsing middleware
  app.use(express.json({ limit: REQUEST_CONFIG.JSON_LIMIT }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: REQUEST_CONFIG.URL_ENCODED_LIMIT,
    })
  );

  // API routes
  app.use(SERVER_CONSTANTS.API_ENDPOINT, routes);

  // 404 handler
  app.use(SERVER_CONSTANTS.CATCH_ALL_ROUTE, (req, res) => {
    logger.warn(SERVER_MESSAGES.ROUTE_NOT_FOUND, {
      url: req.originalUrl,
      method: req.method,
    });
    res
      .status(STATUS_CODE_NOT_FOUND)
      .json(errorResponse(SERVER_MESSAGES.ROUTE_NOT_FOUND));
  });

  // Global error handler
  app.use((error, req, res) => {
    logger.error(SERVER_MESSAGES.UNHANDLED_ERROR, error);
    res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(SERVER_MESSAGES.INTERNAL_SERVER_ERROR));
  });

  return app;
};

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

/**
 * Start the server
 * @param {number} port - Port number
 */
export const startServer = async (port) => {
  const app = createApp();
  const dbConnected = await initializeDatabase();
  if (!dbConnected) {
    logger.error(LOG_DATABASE.INITIALIZE_DATABASE_FAILED);
    process.exit(1);
  }
  const server = app.listen(port, () => {
    logger.info(`${SERVER_MESSAGES.SIKKA_SERVICE_STARTED} ${port}`);
    logger.info(
      `${SERVER_MESSAGES.API_ENDPOINT_URL} http://localhost:${port}${SERVER_CONSTANTS.API_ENDPOINT}/v1/sikka/request-key`
    );
    logger.info(
      `${SERVER_MESSAGES.ENVIRONMENT_INFO} ${
        process.env.NODE_ENV || SERVER_CONSTANTS.ENVIRONMENT_DEVELOPMENT
      }`
    );
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info(SERVER_MESSAGES.SIGTERM_RECEIVED);
    server.close(() => {
      logger.info(SERVER_MESSAGES.PROCESS_TERMINATED);
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info(SERVER_MESSAGES.SIGINT_RECEIVED);
    server.close(() => {
      logger.info(SERVER_MESSAGES.PROCESS_TERMINATED);
      process.exit(0);
    });
  });

  return server;
};

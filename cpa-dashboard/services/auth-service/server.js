import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import sequelize, {
  testConnection,
  closeConnection,
} from "./config/postgres.config.js";
import logger from "./config/logger.config.js";
import "./app/models/index.js";
import {
  SERVICE_CONFIG,
  CORS_CONFIG,
  SESSION_CONFIG,
  REQUEST_CONFIG,
  HEALTH_MESSAGES,
  WELCOME_MESSAGES,
  AVAILABLE_ENDPOINTS,
  PROCESS_SIGNALS,
  SERVER_ERROR_CODES,
  ENV_VALUES,
} from "./app/utils/constants/server.constants.js";
import { SERVER_ERROR_MESSAGES } from "./app/utils/constants/error.constants.js";
import authRoutes from "./app/routes/index.js";

const PORT = process.env.AUTH_SERVICE_PORT || SERVICE_CONFIG.DEFAULT_PORT;
const NODE_ENV = process.env.NODE_ENV || SERVICE_CONFIG.DEFAULT_ENV;
const SERVICE_NAME = SERVICE_CONFIG.NAME;

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.SERVER_URL,
      process.env.NEXT_PUBLIC_API_URL,
      process.env.PRODUCTION_DOMAIN_HTTPS,
      process.env.PRODUCTION_DOMAIN_HTTP,
    ].filter(Boolean);

    const isAllowedDomain = origin.includes(CORS_CONFIG.ALLOWED_DOMAIN);



    if (allowedOrigins.includes(origin) || isAllowedDomain) {
      callback(null, true);
    } else {
      callback(new Error(SERVER_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED));
    }
  },
  methods: CORS_CONFIG.METHODS,
  allowedHeaders: CORS_CONFIG.ALLOWED_HEADERS,
  exposedHeaders: CORS_CONFIG.EXPOSED_HEADERS,
  credentials: CORS_CONFIG.CREDENTIALS,
  maxAge: CORS_CONFIG.MAX_AGE,
  preflightContinue: CORS_CONFIG.PREFLIGHT_CONTINUE,
  optionsSuccessStatus: CORS_CONFIG.OPTIONS_SUCCESS_STATUS,
};

const sessionOptions = {
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  name: SESSION_CONFIG.NAME,
  cookie: {
    secure: SESSION_CONFIG.COOKIE.SECURE,
    httpOnly: SESSION_CONFIG.COOKIE.HTTP_ONLY,
    sameSite: SESSION_CONFIG.COOKIE.SAME_SITE,
    maxAge: SESSION_CONFIG.COOKIE.MAX_AGE,
  },
};

const morganMiddleware = (_format) => (req, res, next) => {
  logger.info(
    `${req.method} ${req.url} - ${res.statusCode} - ${
      req.get("User-Agent") || "Unknown"
    }`
  );
  next();
};

const generalLimiter = (req, res, next) => next();

app.use(generalLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: REQUEST_CONFIG.JSON_LIMIT }));
app.use(
  express.urlencoded({
    extended: true,
    limit: REQUEST_CONFIG.URL_ENCODED_LIMIT,
  })
);
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(
  morganMiddleware(NODE_ENV === ENV_VALUES.PRODUCTION ? "combined" : "dev")
);

app.get("/health", async (req, res) => {
  try {
    const healthResult = await testConnection();
    const isHealthy = healthResult.database === "connected";

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      service: SERVICE_NAME,
      message: isHealthy
        ? HEALTH_MESSAGES.SERVICE_HEALTHY
        : HEALTH_MESSAGES.DATABASE_CONNECTION_FAILED,
      timestamp: healthResult.timestamp,
      database: healthResult.database,
      environment: NODE_ENV,
    });
  } catch (error) {
    logger.error(HEALTH_MESSAGES.HEALTH_CHECK_FAILED, error);
    res.status(500).json({
      success: false,
      service: SERVICE_NAME,
      message: HEALTH_MESSAGES.HEALTH_CHECK_FAILED,
      timestamp: new Date().toISOString(),
      database: "error",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    message: WELCOME_MESSAGES.SERVICE_WELCOME,
    version: SERVICE_CONFIG.VERSION,
    environment: NODE_ENV,
    port: PORT,
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth",
      token: "/api/v1/auth/token",
    },
  });
});

app.use("/api", authRoutes);

app.use((err, req, res, next) => {
  if (err.message === SERVER_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED) {
    return res.status(403).json({
      success: false,
      service: SERVICE_NAME,
      message: SERVER_ERROR_MESSAGES.CORS_POLICY_VIOLATION,
      error: SERVER_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED,
    });
  }
  next(err);
});

app.use((err, req, res, _next) => {
  logger.error(`Auth Service Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    success: false,
    service: SERVICE_NAME,
    message: SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    ...(NODE_ENV === ENV_VALUES.DEVELOPMENT && { error: err.message }),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    service: SERVICE_NAME,
    message: SERVER_ERROR_MESSAGES.ROUTE_NOT_FOUND,
    path: req.originalUrl,
    availableEndpoints: AVAILABLE_ENDPOINTS,
  });
});

const initializeDatabase = async () => {
  try {
    logger.info("Initializing database connection for", { service: SERVICE_NAME });

    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      throw new Error(SERVER_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED);
    }

    await sequelize.authenticate();
    console.log("✅ Database connection established successfully!");
    logger.info("Database connection established successfully for", { service: SERVICE_NAME });
    return true;
  } catch (error) {
    logger.error(
      `Database initialization error for ${SERVICE_NAME}:`,
      error.message
    );
    return false;
  }
};

const gracefulShutdown = async (signal) => {
  logger.info("Received signal. Starting graceful shutdown for", { service: SERVICE_NAME, signal });
  try {
    await closeConnection();
    logger.info("Database connection closed for", { service: SERVICE_NAME });
    process.exit(0);
  } catch (error) {
    logger.error(`Error during shutdown for ${SERVICE_NAME}:`, error);
    process.exit(1);
  }
};

const setupProcessHandlers = () => {
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception in", { service: SERVICE_NAME, error: error.message });
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection in", { 
      service: SERVICE_NAME, 
      promise: promise.toString(), 
      reason: reason.toString() 
    });
    process.exit(1);
  });

  process.on(PROCESS_SIGNALS.SIGTERM, () =>
    gracefulShutdown(PROCESS_SIGNALS.SIGTERM)
  );
  process.on(PROCESS_SIGNALS.SIGINT, () =>
    gracefulShutdown(PROCESS_SIGNALS.SIGINT)
  );
};

const startServer = async () => {
  try {
    console.log(`

🔧 =
   STARTING AUTH SERVICE
=
📊 Service: ${SERVICE_NAME}
🌍 Environment: ${NODE_ENV}
🔌 Port: ${PORT}
=
🔧 ===========================================
   STARTING AUTH SERVICE====================================
📊 Service: ${SERVICE_NAME}
🌍 Environment: ${NODE_ENV}
🔌 Port: ${PORT}====================================

`);

    logger.info("Starting", { service: SERVICE_NAME });
    logger.info("", { environment: NODE_ENV });
    logger.info("", { port: PORT });

    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      logger.error(
        `Database initialization failed for ${SERVICE_NAME}. Server startup aborted.`
      );
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log(`

🚀 =
   AUTH SERVICE STARTED SUCCESSFULLY
=
🚀 ===========================================
   AUTH SERVICE STARTED SUCCESSFULLY====================================

📊 Service: ${SERVICE_NAME}
🌍 Environment: ${NODE_ENV}
🔌 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
❤️  Health Check: http://localhost:${PORT}/health

📋 Available Endpoints:
   • Authentication: /api/v1/auth
   • Token Management: /api/v1/auth/token

✅ Service is ready and accepting requests!

=====================================

`);

      logger.info("running on port", { port: PORT, service: SERVICE_NAME });
      logger.info("", { url: `http://localhost:${PORT}` });
      logger.info("", { url: `http://localhost:${PORT}/health` });
      logger.info("ready!", { service: SERVICE_NAME });
    });

    server.on("error", (error) => {
      if (error.code === SERVER_ERROR_CODES.EADDRINUSE) {
        logger.error("Port is already in use for", { service: SERVICE_NAME, port: PORT });
      } else {
        logger.error("error:", { service: SERVICE_NAME, error: error.message });
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error("startup failed:", { service: SERVICE_NAME, error: error.message });
    process.exit(1);
  }
};

const initializeAuthService = async () => {
  try {
    setupProcessHandlers();
    await startServer();
  } catch (error) {
    logger.error("Failed to initialize auth service:", error);
    process.exit(1);
  }
};

initializeAuthService();

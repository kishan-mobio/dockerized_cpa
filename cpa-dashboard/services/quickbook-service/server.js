import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sequelize, { testConnection, closeConnection } from './config/postgres.config.js';
import logger from './config/logger.config.js';
// import { generalLimiter } from './app/middleware/ratelimit.middleware.js';
import {
  QUICKBOOKS_SERVICE_CONFIG,
  QUICKBOOKS_CORS_CONFIG,
  QUICKBOOKS_SESSION_CONFIG,
  QUICKBOOKS_REQUEST_CONFIG,
  QUICKBOOKS_AVAILABLE_ENDPOINTS,
  QUICKBOOKS_PROCESS_SIGNALS,
  QUICKBOOKS_SERVER_ERROR_CODES,
  QUICKBOOKS_DEFAULT_VALUES,
} from './app/utils/constants/config.constants.js';
import {
  QUICKBOOKS_HEALTH_MESSAGES,
  QUICKBOOKS_ERROR_MESSAGES,
} from './app/utils/constants/error.constants.js';
import {
  QUICKBOOKS_SYSTEM_LOGS,
} from './app/utils/constants/log.constants.js';
import quickbooksRoutes from './app/routes/index.js';

const PORT = process.env.QUICKBOOKS_SERVICE_PORT || QUICKBOOKS_SERVICE_CONFIG.DEFAULT_PORT;
const NODE_ENV = process.env.NODE_ENV || QUICKBOOKS_SERVICE_CONFIG.DEFAULT_ENV;
const SERVICE_NAME = QUICKBOOKS_SERVICE_CONFIG.NAME;

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
    
    const isAllowedDomain = origin.includes(QUICKBOOKS_CORS_CONFIG.ALLOWED_DOMAIN);
    
    if (allowedOrigins.includes(origin) || isAllowedDomain) {
      logger.info(QUICKBOOKS_SYSTEM_LOGS.CORS_ALLOWING_ORIGIN, { origin });
      callback(null, true);
    } else {
      logger.warn(QUICKBOOKS_SYSTEM_LOGS.CORS_BLOCKING_ORIGIN, { origin });
      callback(new Error(QUICKBOOKS_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED));
    }
  },
  methods: QUICKBOOKS_CORS_CONFIG.METHODS,
  allowedHeaders: QUICKBOOKS_CORS_CONFIG.ALLOWED_HEADERS,
  exposedHeaders: QUICKBOOKS_CORS_CONFIG.EXPOSED_HEADERS,
  credentials: QUICKBOOKS_CORS_CONFIG.CREDENTIALS,
  maxAge: QUICKBOOKS_CORS_CONFIG.MAX_AGE,
  preflightContinue: QUICKBOOKS_CORS_CONFIG.PREFLIGHT_CONTINUE,
  optionsSuccessStatus: QUICKBOOKS_CORS_CONFIG.OPTIONS_SUCCESS_STATUS,
};

const sessionOptions = {
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  name: QUICKBOOKS_SESSION_CONFIG.NAME,
  cookie: {
    secure: QUICKBOOKS_SESSION_CONFIG.COOKIE.SECURE,
    httpOnly: QUICKBOOKS_SESSION_CONFIG.COOKIE.HTTP_ONLY,
    sameSite: QUICKBOOKS_SESSION_CONFIG.COOKIE.SAME_SITE,
    maxAge: QUICKBOOKS_SESSION_CONFIG.COOKIE.MAX_AGE,
  },
  // Note: For production, consider using Redis or another persistent session store
  // instead of MemoryStore to avoid memory leaks and enable scaling
};

// app.use(generalLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: QUICKBOOKS_REQUEST_CONFIG.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: QUICKBOOKS_REQUEST_CONFIG.URL_ENCODED_LIMIT }));
app.use(cookieParser());
app.use(session(sessionOptions));

app.get('/health', async (req, res) => {
  try {
    const healthResult = await testConnection();
    const isHealthy = healthResult.success;
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      service: SERVICE_NAME,
      message: isHealthy ? QUICKBOOKS_HEALTH_MESSAGES.SERVICE_HEALTHY : QUICKBOOKS_HEALTH_MESSAGES.DATABASE_CONNECTION_FAILED,
      timestamp: new Date().toISOString(),
      database: healthResult.database || 'disconnected',
      environment: NODE_ENV,
      version: QUICKBOOKS_SERVICE_CONFIG.VERSION,
    });
  } catch (error) {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.HEALTH_CHECK_FAILED, { error: error.message });
    res.status(500).json({
      success: false,
      service: SERVICE_NAME,
      message: QUICKBOOKS_HEALTH_MESSAGES.HEALTH_CHECK_FAILED,
      timestamp: new Date().toISOString(),
      database: 'error',
      environment: NODE_ENV,
    });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    message: 'QuickBooks Integration and Reports Service',
    version: QUICKBOOKS_SERVICE_CONFIG.VERSION,
    environment: NODE_ENV,
    port: PORT,
    endpoints: {
      health: '/health',
      quickbooks: '/api/v1/quickbooks',
      reports: '/api/v1/reports',
    }
  });
});

app.use('/api', quickbooksRoutes);

app.use((err, req, res, next) => {
  if (err.message === QUICKBOOKS_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED) {
    return res.status(403).json({
      success: false,
      service: SERVICE_NAME,
      message: QUICKBOOKS_ERROR_MESSAGES.CORS_POLICY_VIOLATION,
      error: QUICKBOOKS_ERROR_MESSAGES.ORIGIN_NOT_ALLOWED,
    });
  }
  next(err);
});

app.use((err, req, res, _next) => {
  logger.error(QUICKBOOKS_SYSTEM_LOGS.SERVICE_ERROR, { 
    error: err.message, 
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  res.status(500).json({
    success: false,
    service: SERVICE_NAME,
    message: QUICKBOOKS_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === QUICKBOOKS_DEFAULT_VALUES.DEVELOPMENT && { error: err.message })
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    service: SERVICE_NAME,
    message: QUICKBOOKS_ERROR_MESSAGES.ROUTE_NOT_FOUND,
    path: req.originalUrl,
    availableEndpoints: QUICKBOOKS_AVAILABLE_ENDPOINTS
  });
});

const initializeDatabase = async () => {
  try {
    logger.info(QUICKBOOKS_SYSTEM_LOGS.DATABASE_INITIALIZING, { service: SERVICE_NAME });
    
    const connectionResult = await testConnection();
    ('connectionResult', connectionResult);
    if (!connectionResult.success) {
      throw new Error(QUICKBOOKS_ERROR_MESSAGES.DATABASE_CONNECTION_FAILED);
    }
    
    await sequelize.authenticate();
    logger.info('Database connection established successfully!');
    logger.info(QUICKBOOKS_SYSTEM_LOGS.DATABASE_CONNECTION_SUCCESS, { service: SERVICE_NAME });
    return true;
  } catch (error) {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.DATABASE_INITIALIZATION_ERROR, { 
      service: SERVICE_NAME, 
      error: error.message 
    });
    return false;
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(QUICKBOOKS_SYSTEM_LOGS.GRACEFUL_SHUTDOWN, { signal, service: SERVICE_NAME });
  try {
    await closeConnection();
    logger.info(QUICKBOOKS_SYSTEM_LOGS.DATABASE_CONNECTION_CLOSED, { service: SERVICE_NAME });
    process.exit(0);
  } catch (error) {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.SHUTDOWN_ERROR, { service: SERVICE_NAME, error: error.message });
    process.exit(1);
  }
};

const setupProcessHandlers = () => {
  process.on('uncaughtException', (error) => {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.UNCAUGHT_EXCEPTION, { service: SERVICE_NAME, error: error.message });
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.UNHANDLED_REJECTION, { 
      service: SERVICE_NAME, 
      reason: reason?.message || reason,
      promise: promise?.toString() 
    });
    process.exit(1);
  });
  
  process.on(QUICKBOOKS_PROCESS_SIGNALS.SIGTERM, () => gracefulShutdown(QUICKBOOKS_PROCESS_SIGNALS.SIGTERM));
  process.on(QUICKBOOKS_PROCESS_SIGNALS.SIGINT, () => gracefulShutdown(QUICKBOOKS_PROCESS_SIGNALS.SIGINT));
};

const startServer = async () => {
  try {

    logger.info('===========================================');
    logger.info('   STARTING QUICKBOOKS SERVICE');
    logger.info('===========================================');
    logger.info(`Service: ${SERVICE_NAME}`);
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Port: ${PORT}`);
    logger.info('===========================================');

    
    logger.info(QUICKBOOKS_SYSTEM_LOGS.SERVICE_STARTING, { service: SERVICE_NAME });
    logger.info(QUICKBOOKS_SYSTEM_LOGS.ENVIRONMENT, { environment: NODE_ENV });
    logger.info(QUICKBOOKS_SYSTEM_LOGS.SERVICE_PORT, { port: PORT });
    
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      logger.error(QUICKBOOKS_SYSTEM_LOGS.DATABASE_INIT_FAILED, { service: SERVICE_NAME });
      logger.error(QUICKBOOKS_SYSTEM_LOGS.SERVER_STARTUP_ABORTED);
      process.exit(1);
    }
    
    const server = app.listen(PORT, () => {

      logger.info('===========================================');
      logger.info('   QUICKBOOKS SERVICE STARTED SUCCESSFULLY');
      logger.info('===========================================');
      logger.info(`Service: ${SERVICE_NAME}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`Port: ${PORT}`);
      logger.info(`URL: http://localhost:${PORT}`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
      logger.info('Available Endpoints:');
      logger.info('   QuickBooks Integration: /api/v1/quickbooks');
      logger.info('   Reports Generation: /api/v1/reports');
      logger.info('Service is ready and accepting requests!');
      logger.info('===========================================');

      
      // Also log to file for debugging
      logger.info(QUICKBOOKS_SYSTEM_LOGS.SERVICE_RUNNING, { service: SERVICE_NAME, port: PORT });
      logger.info(QUICKBOOKS_SYSTEM_LOGS.ACCESS_URL, { url: `http://localhost:${PORT}` });
      logger.info(QUICKBOOKS_SYSTEM_LOGS.HEALTH_CHECK_URL, { url: `http://localhost:${PORT}/health` });
      logger.info(QUICKBOOKS_SYSTEM_LOGS.SERVICE_READY, { service: SERVICE_NAME });
    });
    
    server.on('error', (error) => {
      if (error.code === QUICKBOOKS_SERVER_ERROR_CODES.EADDRINUSE) {
        logger.error(QUICKBOOKS_SYSTEM_LOGS.PORT_IN_USE_ERROR, { service: SERVICE_NAME, port: PORT });
      } else {
        logger.error(QUICKBOOKS_SYSTEM_LOGS.SERVICE_ERROR, { service: SERVICE_NAME, error: error.message });
      }
      process.exit(1);
    });
    
    return server;
  } catch (error) {
    logger.error(QUICKBOOKS_SYSTEM_LOGS.SERVICE_STARTUP_FAILED, { service: SERVICE_NAME, error: error.message });
    process.exit(1);
  }
};

setupProcessHandlers();
startServer();

// SERVER CONSTANTS - Auth Service Specific Constants

// Service Configuration
export const SERVICE_CONFIG = {
  NAME: 'Auth Service',
  VERSION: 'v1',
  DEFAULT_PORT: 3001,
  DEFAULT_ENV: 'development',
};

// CORS Configuration
export const CORS_CONFIG = {
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  EXPOSED_HEADERS: ['Content-Range', 'X-Content-Range'],
  CREDENTIALS: true,
  MAX_AGE: 86400,
  PREFLIGHT_CONTINUE: false,
  OPTIONS_SUCCESS_STATUS: 204,
  ALLOWED_DOMAIN: 'getondataconsulting.in',
};

// Session Configuration
export const SESSION_CONFIG = {
  NAME: 'auth_session_cookie',
  COOKIE: {
    SECURE: process.env.NODE_ENV === 'production',
    HTTP_ONLY: true,
    SAME_SITE: 'strict',
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Request Configuration
export const REQUEST_CONFIG = {
  JSON_LIMIT: '10kb',
  URL_ENCODED_LIMIT: '10kb',
};

// Health Check Messages
export const HEALTH_MESSAGES = {
  SERVICE_HEALTHY: 'Auth service is healthy',
  HEALTH_CHECK_FAILED: 'Auth service health check failed',
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
};

// Welcome Messages
export const WELCOME_MESSAGES = {
  SERVICE_WELCOME: 'Welcome to CPA Dashboard Auth Service',
};

// Available Endpoints
export const AVAILABLE_ENDPOINTS = [
  '/api/v1/auth',
  '/api/v1/auth/token',
];

// Process Signals
export const PROCESS_SIGNALS = {
  SIGTERM: 'SIGTERM',
  SIGINT: 'SIGINT',
};

// Server Error Codes
export const SERVER_ERROR_CODES = {
  EADDRINUSE: 'EADDRINUSE',
};

// Environment Values
export const ENV_VALUES = {
  NO_ORIGIN: 'No origin',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export default {
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
};

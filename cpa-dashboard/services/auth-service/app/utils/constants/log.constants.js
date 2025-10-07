// LOG CONSTANTS - Logger Messages and Names for Auth Service

// Log Levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly',
};

// Log Formats
export const LOG_FORMATS = {
  COMBINED: 'combined',
  COMMON: 'common',
  DEV: 'dev',
  SHORT: 'short',
  TINY: 'tiny',
  JSON: 'json',
};

// Logger Names Constants
export const LOGGER_NAMES = {
  // Controllers
  AUTH_CONTROLLER: 'AuthController',
  TOKEN_CONTROLLER: 'TokenController',
  
  // Services
  AUTH_SERVICE: 'AuthService',
  TOKEN_SERVICE: 'TokenService',
  EMAIL_SERVICE: 'EmailService',
  MFA_SERVICE: 'MFAService',
  
  // Middleware
  AUTH_MIDDLEWARE: 'AuthMiddleware',
  VALIDATION_MIDDLEWARE: 'ValidationMiddleware',
  RATELIMIT_MIDDLEWARE: 'RateLimitMiddleware',
  
  // Repositories
  AUTH_REPOSITORY: 'AuthRepository',
  TOKEN_REPOSITORY: 'TokenRepository',
  USER_REPOSITORY: 'UserRepository',
  
  // Configuration
  AWS_CONFIG: 'AWSConfig',
  POSTGRES_CONFIG: 'PostgresConfig',
  APP_CONFIG: 'AppConfig',
  
  // Utils
  CRUD_FACTORY: 'CRUDFactory',
  
  // System
  SERVER: 'Server',
  DATABASE: 'Database',
  SECURITY: 'Security',
  
  // Log File Types
  LOG_FILE_TYPES: {
    APPLICATION: 'application',
    ERROR: 'error',
    EXCEPTIONS: 'exceptions',
    REJECTIONS: 'rejections',
  },
  
  // Service Names
  SERVICE_NAMES: {
    AUTH_SERVICE: 'auth-service',
  }
};

// AUTH SERVICE LOGGER MESSAGES
export const LOGGER_MESSAGES = {
  // Server Messages
  SERVER: {
    START: 'Auth service server started on port: %s',
    STOP: 'Auth service server stopped',
    ERROR: 'Server error: %s',
  },

  // Database Messages
  DATABASE: {
    CONNECT_SUCCESS: 'Successfully connected to database',
    CONNECT_ERROR: 'Database connection error: %s',
    QUERY_ERROR: 'Database query error: %s',
    DISCONNECT: 'Database disconnected',
  },

  // Authentication Messages
  AUTH: {
    LOGIN_ATTEMPT: 'Login attempt for user: %s',
    LOGIN_SUCCESS: 'User logged in successfully: %s',
    LOGIN_FAILED: 'Login failed for user: %s',
    LOGOUT: 'User logged out: %s',
    TOKEN_CREATED: 'New token created for user: %s',
    TOKEN_VERIFIED: 'Token verified for user: %s',
    TOKEN_INVALID: 'Invalid token detected',
    TOKEN_EXPIRED: 'Token expired for user: %s',
    UNAUTHORIZED: 'Unauthorized access attempt',
    INVITE_SENT: 'Invitation sent to user: %s',
    INVITE_USER_ATTEMPT: 'INVITE_USER_ATTEMPT',
    INVITE_USER_SUCCESS: 'INVITE_USER_SUCCESS',
    REGISTRATION_SUCCESS: 'User registration successful: %s',
    EMAIL_VERIFIED: 'Email verified for user: %s',
    ACCOUNT_LOCKED: 'Account locked for user: %s',
    PASSWORD_RESET_REQUESTED: 'Password reset requested for user: %s',
    PASSWORD_RESET_SUCCESS: 'Password reset successful for user: %s',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  },

  // Token Management Messages
  TOKEN: {
    REFRESH: 'Token refreshed for user: %s',
    REVOKE: 'Token revoked for user: %s',
    REVOKE_ALL: 'All tokens revoked for user: %s',
    VALIDATE: 'Token validated for user: %s',
    BLACKLIST: 'Token blacklisted: %s',
  },

  // Security Messages
  SECURITY: {
    ACCESS_DENIED: 'Access denied for user: %s',
    INVALID_REQUEST: 'Invalid request detected from IP: %s',
    RATE_LIMIT: 'Rate limit exceeded for IP: %s',
    MFA_SETUP: 'MFA setup started for user: %s',
    MFA_ENABLED: 'MFA enabled for user: %s',
    MFA_VERIFIED: 'MFA verified for user: %s',
    MFA_FAILED: 'MFA verification failed for user: %s',
  },

  // Request/Response Messages
  REQUEST: {
    VALIDATION_FAILED: 'Request validation failed: %s',
  },

  // Error Messages
  ERROR: {
    INTERNAL: 'Internal server error: %s',
    VALIDATION: 'Validation error: %s',
    NOT_FOUND: 'Resource not found: %s',
    
    // Repository Errors
    REPOSITORY: {
      CREATE_USER_ERROR: 'Error in createUser in auth.repository.js:',
      FIND_USER_BY_EMAIL_ERROR: 'Error in findUserByEmail in auth.repository.js:',
      FIND_USER_BY_ID_ERROR: 'Error in findUserById in auth.repository.js:',
      FIND_USER_ERROR: 'Error in findUser in auth.repository.js:',
      UPDATE_USER_ERROR: 'Error in updateUser in auth.repository.js:',
      DELETE_USER_ERROR: 'Error in deleteUser in auth.repository.js:',
    },
    
    // Controller Errors
    CONTROLLER: {
      INVITE_USER_ERROR: 'inviteUser in auth.controller.js:',
      REGISTER_ERROR: 'register in auth.controller.js:',
      VERIFY_EMAIL_ERROR: 'verifyEmail in auth.controller.js:',
      LOGIN_ERROR: 'login in auth.controller.js:',
      LOGOUT_ERROR: 'logout in auth.controller.js:',
      SETUP_MFA_ERROR: 'setupMFA in auth.controller.js:',
      VERIFY_MFA_ERROR: 'verifyMFA in auth.controller.js:',
      FORGOT_PASSWORD_ERROR: 'forgotPassword in auth.controller.js:',
      RESET_PASSWORD_ERROR: 'resetPassword in auth.controller.js:',
      SIGNUP_ERROR: 'signUp in auth.controller.js:',
      GET_PROFILE_ERROR: 'getProfile in auth.controller.js:',
      CHANGE_PASSWORD_ERROR: 'changePassword in auth.controller.js:',
      UPDATE_PROFILE_ERROR: 'updateProfile in auth.controller.js:',
    },
    
    // Service Errors
    SERVICE: {
      GENERAL_ERROR: 'Service error in %s:',
      PASSWORD_VALIDATION_ERROR: 'Password validation error:',
      FORGOT_PASSWORD_ERROR: 'Forgot password service error:',
      RESET_PASSWORD_ERROR: 'Reset password service error:',
      VALIDATE_INVITE_TOKEN_ERROR: 'Error validating invite token:',
      VALIDATE_EMAIL_VERIFICATION_TOKEN_ERROR: 'Error validating email verification token:',
      VALIDATE_RESET_TOKEN_ERROR: 'Error validating reset token:',
      SETUP_MFA_ERROR: 'Error setting up MFA:',
      VERIFY_MFA_ERROR: 'Error verifying MFA:',
      REFRESH_TOKEN_ERROR: 'Refresh token service error:',
      REVOKE_TOKEN_ERROR: 'Revoke token service error:',
      GET_ACTIVE_TOKENS_ERROR: 'Get active tokens service error:',
      REVOKE_ALL_TOKENS_ERROR: 'Revoke all tokens service error:',
      VALIDATE_TOKEN_ERROR: 'Validate token service error:',
    },
    
    // Server Errors
    SERVER: {
      AUTH_SERVICE_ERROR: 'Auth Service Error: %s',
      DATABASE_INITIALIZATION_ERROR: 'Database initialization error for %s:',
      SHUTDOWN_ERROR: 'Error during shutdown for %s:',
    },
  },

  // Database Operation Messages
  DB: {
    CREATE_SUCCESS: 'Successfully created record: %s',
    UPDATE_SUCCESS: 'Successfully updated record: %s',
    DELETE_SUCCESS: 'Successfully deleted record: %s',
    QUERY_ERROR: 'Error executing query: %s',
  },

  // Common Messages
  COMMON: {
    MISSING_ENV_VARS: 'Missing required environment variables:',
    ENV_VARS_VALIDATED: 'Environment variables validated successfully',
    CONFIG_INITIALIZED: 'Configuration initialized successfully',
    CONFIG_INIT_FAILED: 'Configuration initialization failed:',
  },

  // Server Log Messages
  SERVER_LOG: {
    CORS_ALLOWING_ORIGIN: 'CORS: Allowing origin',
    CORS_BLOCKING_ORIGIN: 'CORS: Blocking origin',
    REQUEST_LOG: 'Request log',
    DATABASE_INITIALIZING: 'Initializing database connection for',
    DATABASE_CONNECTION_SUCCESS: 'Database connection established successfully for',
    DATABASE_INITIALIZATION_ERROR: 'Database initialization error for',
    GRACEFUL_SHUTDOWN: 'Received signal. Starting graceful shutdown for',
    DATABASE_CONNECTION_CLOSED: 'Database connection closed for',
    SHUTDOWN_ERROR: 'Error during shutdown for',
    UNCAUGHT_EXCEPTION: 'Uncaught Exception in',
    UNHANDLED_REJECTION: 'Unhandled Rejection in',
    SERVICE_STARTING: 'Starting',
    SERVICE_RUNNING: 'running on port',
    SERVICE_ACCESS_URL: 'Access URL',
    SERVICE_HEALTH_CHECK: 'Health check',
    SERVICE_ENDPOINTS: 'Auth Service Endpoints',
    SERVICE_READY: 'ready!',
    SERVICE_STARTUP_FAILED: 'startup failed',
    PORT_IN_USE_ERROR: 'Port is already in use for',
    SERVICE_ERROR: 'error',
  }
};

export default {
  LOG_LEVELS,
  LOG_FORMATS,
  LOGGER_NAMES,
  LOGGER_MESSAGES,
};

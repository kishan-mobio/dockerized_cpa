import 'dotenv/config';
import { createLogger } from '../app/utils/logger.utils.js';
import { CONFIG_DEFAULTS, CONFIG_ENV_TYPES } from '../app/utils/constants/config.constants.js';

const logger = createLogger('SHARED_CONFIG');

/**
 * Parse environment variable value based on type
 * @param {string} value - Environment variable value
 * @param {string} type - Expected type (string, number, boolean, array, json)
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed value
 */
export const parseEnvValue = (value, type = CONFIG_ENV_TYPES.STRING, defaultValue = null) => {
  if (!value) return defaultValue;
  
  switch (type) {
    case CONFIG_ENV_TYPES.NUMBER:
      const num = parseInt(value, 10);
      return isNaN(num) ? defaultValue : num;
    case CONFIG_ENV_TYPES.BOOLEAN:
      return value.toLowerCase() === 'true';
    case CONFIG_ENV_TYPES.ARRAY:
      return value.split(',').map(item => item.trim());
    case CONFIG_ENV_TYPES.JSON:
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    default:
      return value;
  }
};

/**
 * Validate required environment variables
 * @param {Array<string>} requiredVars - Array of required environment variable names
 * @param {string} moduleName - Name of the module for error context
 * @throws {Error} If any required variables are missing
 */
export const validateRequiredEnvVars = (requiredVars, moduleName = 'Configuration') => {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    const error = `Missing required environment variables for ${moduleName}: ${missingVars.join(', ')}`;
    logger.error(error);
    throw new Error(error);
  }
  logger.info(`✅ Environment variables validated for ${moduleName}`);
};

/**
 * Get database configuration based on environment
 * @returns {Object} Database configuration object
 */
export const getDatabaseConfig = () => {
  // Auto-detect local database based on host or explicit environment variable
  const isLocalDatabase = process.env.USE_LOCAL_DB === 'true' || 
    process.env.DB_HOST === 'localhost' || 
    process.env.DB_HOST === '127.0.0.1' || 
    process.env.DB_HOST === 'postgres' ||
    !process.env.DB_HOST; // Default to local if no host specified
  
  logger.info('🔧 Database Configuration Detection', {
    USE_LOCAL_DB: process.env.USE_LOCAL_DB,
    DB_HOST: process.env.DB_HOST,
    isLocalDatabase: isLocalDatabase,
    detectedReason: isLocalDatabase ? 
      (process.env.USE_LOCAL_DB === 'true' ? 'USE_LOCAL_DB=true' :
       process.env.DB_HOST === 'localhost' ? 'host=localhost' :
       process.env.DB_HOST === '127.0.0.1' ? 'host=127.0.0.1' :
       process.env.DB_HOST === 'postgres' ? 'host=postgres' :
       'no host specified') : 'cloud database'
  });
  
  if (isLocalDatabase) {
    return {
      database: process.env.LOCAL_DB_NAME || process.env.DB_NAME,
      username: process.env.LOCAL_DB_USER || process.env.DB_USER,
      password: process.env.LOCAL_DB_PASS || process.env.DB_PASS,
      host: process.env.LOCAL_DB_HOST || process.env.DB_HOST,
      port: parseEnvValue(process.env.LOCAL_DB_PORT || process.env.DB_PORT, CONFIG_ENV_TYPES.NUMBER, 5432),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: false
      },
      isLocal: true
    };
  } else {
    return {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: parseEnvValue(process.env.DB_PORT, CONFIG_ENV_TYPES.NUMBER, 5432),
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      isLocal: false
    };
  }
};

/**
 * Get logging configuration
 * @returns {Object} Logging configuration object
 */
export const getLoggingConfig = () => {
  return {
    level: process.env.LOG_LEVEL || CONFIG_DEFAULTS.LOG_INFO_LEVEL,
    format: process.env.LOG_FORMAT || 'combined',
    filePath: process.env.LOG_FILE_PATH || CONFIG_DEFAULTS.LOG_DIRECTORY,
    maxSize: process.env.LOG_MAX_SIZE || CONFIG_DEFAULTS.LOG_MAX_SIZE,
    maxFiles: parseEnvValue(process.env.LOG_MAX_FILES, CONFIG_ENV_TYPES.NUMBER, CONFIG_DEFAULTS.LOG_MAX_FILES),
    enableConsole: parseEnvValue(process.env.LOG_ENABLE_CONSOLE, CONFIG_ENV_TYPES.BOOLEAN, true)
  };
};

/**
 * Get server configuration
 * @returns {Object} Server configuration object
 */
export const getServerConfig = () => {
  return {
    port: parseEnvValue(process.env.QUICKBOOKS_SERVICE_PORT, CONFIG_ENV_TYPES.NUMBER, 3004),
    url: process.env.SERVER_URL,
    host: process.env.HOST,
    protocol: process.env.PROTOCOL
  };
};

/**
 * Get authentication configuration
 * @returns {Object} Authentication configuration object
 */
export const getAuthConfig = () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
    bcryptRounds: parseEnvValue(process.env.BCRYPT_ROUNDS, CONFIG_ENV_TYPES.NUMBER, CONFIG_DEFAULTS.BCRYPT_ROUNDS),
    sessionSecret: process.env.SESSION_SECRET,
    cookieMaxAge: parseEnvValue(process.env.COOKIE_MAX_AGE, CONFIG_ENV_TYPES.NUMBER, CONFIG_DEFAULTS.COOKIE_MAX_AGE),
    encryptionKey: process.env.ENCRYPTION_KEY
  };
};

/**
 * Get QuickBooks configuration
 * @returns {Object} QuickBooks configuration object
 */
export const getQuickbooksConfig = () => {
  return {
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
    tokenUrl: process.env.QUICKBOOKS_TOKEN_URL,
    baseUrl: process.env.PRODUCTION_URL,
    apiBaseUrl: process.env.QUICKBOOKS_API_BASE_URL,
    apiVersion: process.env.QUICKBOOKS_API_VERSION,
    environment: process.env.QUICKBOOKS_ENVIRONMENT,
    scopes: process.env.QUICKBOOKS_SCOPES,
    oauthBaseUrl: process.env.QUICKBOOKS_OAUTH_BASE_URL,
    apiProductionUrl: process.env.PRODUCTION_URL
  };
};

/**
 * Get client configuration
 * @returns {Object} Client configuration object
 */
export const getClientConfig = () => {
  return {
    url: process.env.FRONTEND_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    cookieDomain: process.env.COOKIE_DOMAIN
  };
};

/**
 * Initialize configuration with validation
 * @param {Array<string>} requiredVars - Required environment variables
 * @param {string} moduleName - Module name for logging
 * @returns {Object} Configuration object
 */
export const initializeConfig = (requiredVars = [], moduleName = 'Configuration') => {
  try {
    if (requiredVars.length > 0) {
      validateRequiredEnvVars(requiredVars, moduleName);
    }
    
    logger.info(`✅ ${moduleName} initialized successfully`, {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    return {
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === CONFIG_DEFAULTS.NODE_ENV,
      isProduction: process.env.NODE_ENV === CONFIG_ENV_TYPES.PRODUCTION,
      isTest: process.env.NODE_ENV === CONFIG_ENV_TYPES.TEST,
      server: getServerConfig(),
      client: getClientConfig(),
      database: getDatabaseConfig(),
      auth: getAuthConfig(),
      quickbooks: getQuickbooksConfig(),
      logging: getLoggingConfig()
    };
  } catch (error) {
    logger.error(`❌ ${moduleName} initialization failed:`, error);
    throw error;
  }
};

export default {
  parseEnvValue,
  validateRequiredEnvVars,
  getDatabaseConfig,
  getLoggingConfig,
  getServerConfig,
  getAuthConfig,
  getQuickbooksConfig,
  getClientConfig,
  initializeConfig
};

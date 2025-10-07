import {
  QUICKBOOKS_SERVICE_LOGS,
  QUICKBOOKS_COMMON_LOGS,
} from '../utils/constants/log.constants.js';
import {
  QUICKBOOKS_DATABASE, 
  QUICKBOOKS_DEFAULTS,
  QUICKBOOKS_FIELD_NAMES,
  QUICKBOOKS_HTTP_HEADERS} from '../utils/constants/config.constants.js';
import { QUICKBOOKS_MESSAGES } from '../utils/constants/error.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import logger from '../../config/logger.config.js';
import axios from 'axios';
import { decrypt, encrypt } from '../utils/encryption.utils.js';
import { GLAccountMaster } from '../models/index.js';
import knex from 'knex';







// Environment configuration with validation
const QB_ENV = {
  clientID: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  tokenUrl: process.env.QUICKBOOKS_TOKEN_URL,
  baseUrl: process.env.SANDBOX_URL,
  dbServer: process.env.DB_SERVER,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD
};



// Validate critical environment variables
const validateEnvironment = () => {
  const required = HARDCODED_STRINGS.REQUIRED_ENV_VARS;
  const missing = required.filter(key => !QB_ENV[key]);
  if (missing.length > 0) {
    throw new Error(`${HARDCODED_STRINGS.MISSING_REQUIRED_ENV_VARS}: ${missing.join(', ')}`);
  }
};



// Initialize environment validation
try {
  validateEnvironment();
} catch (error) {
  logger.error(QUICKBOOKS_SERVICE_LOGS.DATABASE_CONNECTION_ERROR, { error: error.message });
}



// Cache for database connections to improve performance
const dbConnectionCache = new Map();

/**
 * Creates optimized database configuration with connection pooling
 * @param {string} databaseName - Target database name
 * @returns {Object} Knex configuration object
 */

const createDBConfig = (databaseName) => {
  // Use local database configuration
  const isLocalDatabase = process.env.USE_LOCAL_DB === 'true';

  const finalHost = process.env.LOCAL_DB_HOST;
  const finalUser = process.env.LOCAL_DB_USER;
  const finalPassword = process.env.LOCAL_DB_PASS;
  const finalPort = parseInt(process.env.LOCAL_DB_PORT);


  return {
  client: HARDCODED_STRINGS.DB_CONFIG.CLIENT, // Now uses postgresql from constants
  connection: {
      host: finalHost,
      user: finalUser,
      password: finalPassword,
      database: databaseName || process.env.LOCAL_DB_NAME,
      port: finalPort,
      ssl: isLocalDatabase ? false : { rejectUnauthorized: false }
  },
  pool: {
    min: QUICKBOOKS_DEFAULTS.POOL_MIN,
    max: QUICKBOOKS_DEFAULTS.POOL_MAX,
    acquireTimeoutMillis: QUICKBOOKS_DEFAULTS.POOL_ACQUIRE_TIMEOUT,
    idleTimeoutMillis: QUICKBOOKS_DEFAULTS.POOL_IDLE_TIMEOUT,
    createTimeoutMillis: QUICKBOOKS_DEFAULTS.POOL_CREATE_TIMEOUT,
    destroyTimeoutMillis: QUICKBOOKS_DEFAULTS.POOL_DESTROY_TIMEOUT,
    reapIntervalMillis: QUICKBOOKS_DEFAULTS.POOL_REAP_INTERVAL,
    createRetryIntervalMillis: QUICKBOOKS_DEFAULTS.POOL_RETRY_INTERVAL
  },
  acquireConnectionTimeout: QUICKBOOKS_DEFAULTS.POOL_ACQUIRE_TIMEOUT,
  debug: process.env.NODE_ENV === HARDCODED_STRINGS.NODE_ENV_DEVELOPMENT
  };
};







/**
 * Creates or retrieves cached Knex database instance
 * @param {string} databaseName - Database name
 * @returns {Promise<Object>} Knex instance
 */
export const createKnexInstance = async (databaseName) => {
  if (dbConnectionCache.has(databaseName)) {
    const cachedInstance = dbConnectionCache.get(databaseName);
    try {
      await cachedInstance.raw(HARDCODED_STRINGS.SELECT_1);
      return cachedInstance;
    } catch {
      dbConnectionCache.delete(databaseName);
      await cachedInstance.destroy().catch(error => 
        logger.warn(QUICKBOOKS_COMMON_LOGS.ERROR_DESTROYING_CONNECTION, error.message)
      );
    }
  }

  const config = createDBConfig(databaseName);
  const dbInstance = knex(config);
  
  dbInstance.on(HARDCODED_STRINGS.QUERY_ERROR_EVENT, (error) => {
    const connectionErrors = [
      QUICKBOOKS_DATABASE.QB_DB_CONNECTION_CLOSED,
      QUICKBOOKS_DATABASE.QB_DB_CONNECTION_TIMEOUT,
      QUICKBOOKS_DATABASE.ERROR_TYPES.ETIMEOUT,
      QUICKBOOKS_DATABASE.ERROR_TYPES.ECONNRESET
    ];
    
    const isConnectionError = connectionErrors.some(errorType => 
      error.message.includes(errorType)
    );
    
    if (isConnectionError) {
      logger.error(QUICKBOOKS_SERVICE_LOGS.DATABASE_CONNECTION_ERROR + error.message);
      logger.info(QUICKBOOKS_SERVICE_LOGS.ATTEMPTING_RECONNECT);
      
      dbConnectionCache.delete(databaseName);
      dbInstance.destroy().catch(() => 
        logger.warn(QUICKBOOKS_COMMON_LOGS.ERROR_DESTROYING_OLD_CONNECTION)
      );
    }
  });

  dbConnectionCache.set(databaseName, dbInstance);
  return dbInstance;
};



/**
 * Retries database queries with exponential backoff
 * @param {Function} queryFn - Query function to execute
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Base delay in milliseconds
 * @returns {Promise<*>} Query result
 */
export const retryQuery = async (
  queryFn, 
  maxRetries = QUICKBOOKS_DEFAULTS.MAX_RETRIES, 
  delay = QUICKBOOKS_DEFAULTS.RETRY_DELAY_MS
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      const retryableErrors = [
        QUICKBOOKS_DATABASE.ERROR_TYPES.TIMEOUT,
        QUICKBOOKS_DATABASE.ERROR_TYPES.ETIMEOUT,
        QUICKBOOKS_DATABASE.ERROR_TYPES.ECONNRESET
      ];
      
      const isRetryable = retryableErrors.some(errorType => 
        error.message.includes(errorType)
      );
      
      if (isRetryable && attempt < maxRetries) {
        logger.warn(QUICKBOOKS_SERVICE_LOGS.RETRYING_QUERY(attempt, maxRetries));
        await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
      } else {
        logger.error(QUICKBOOKS_SERVICE_LOGS.QUERY_FAILED(attempt, error.message));
        throw error;
      }
    }
  }
};





/**
 * Exchanges authorization code for access tokens
 * @param {string} code - Authorization code from QuickBooks
 * @returns {Promise<Object>} Token data object
 */



export const exchangeAuthCodeForTokens = async (code) => {
  try {
    const authHeader = Buffer.from(`${QB_ENV.clientID}:${QB_ENV.clientSecret}`).toString(HARDCODED_STRINGS.STRING_OPS.BASE64);
    
    const response = await axios.post(
      QB_ENV.tokenUrl,
      new URLSearchParams({
        grant_type: QUICKBOOKS_DEFAULTS.GRANT_TYPE_AUTH_CODE,
        code,
        redirect_uri: process.env.REDIRECT_URI
      }).toString(),
      {
        headers: {
          'Content-Type': HARDCODED_STRINGS.HTTP_HEADERS.CONTENT_TYPE_FORM,
          [QUICKBOOKS_HTTP_HEADERS.AUTHORIZATION]: `${QUICKBOOKS_DEFAULTS.AUTH_BASIC_PREFIX}${authHeader}`
        },
        timeout: QUICKBOOKS_DEFAULTS.REQUEST_TIMEOUT_MS
      }
    );
    
    return response.data;
  } catch (error) {
    logger.error(QUICKBOOKS_SERVICE_LOGS.TOKEN_EXCHANGE_FAILED, error.message);
    throw error;
  }
};



/**
 * Refreshes QuickBooks access tokens
 * @param {Object} quickbookAccount - QuickBooks account object
 * @returns {Promise<Object|null>} Updated account or null if failed
 */



export const refreshTokens = async (quickbookAccount) => {
  try {
    if (!quickbookAccount?.id || !quickbookAccount?.refresh_token) {
      throw new Error(QUICKBOOKS_MESSAGES.ACCOUNT_NOT_FOUND);
    }
    
    const refreshToken = await decrypt(quickbookAccount.refresh_token);
    if (!refreshToken) {
      throw new Error(HARDCODED_STRINGS.FAILED_TO_DECRYPT_REFRESH_TOKEN);
    }
    
    const authString = Buffer.from(`${QB_ENV.clientID}:${QB_ENV.clientSecret}`).toString(HARDCODED_STRINGS.STRING_OPS.BASE64);
    
    const tokenResponse = await axios.post(
      QB_ENV.tokenUrl,
      new URLSearchParams({
        grant_type: QUICKBOOKS_DEFAULTS.GRANT_TYPE_REFRESH,
        refresh_token: refreshToken
      }),
      {
        headers: {
          [QUICKBOOKS_HTTP_HEADERS.AUTHORIZATION]: `${QUICKBOOKS_DEFAULTS.AUTH_BASIC_PREFIX}${authString}`,
          'Content-Type': HARDCODED_STRINGS.HTTP_HEADERS.CONTENT_TYPE_FORM
        },
        timeout: QUICKBOOKS_DEFAULTS.REQUEST_TIMEOUT_MS
      }
    );
    
    if (!tokenResponse.data?.access_token || !tokenResponse.data?.refresh_token) {
      throw new Error(QUICKBOOKS_MESSAGES.INVALID_TOKEN_RESPONSE_FROM_QUICKBOOKS);
    }
    
    const [encryptedRefreshToken, encryptedAccessToken] = await Promise.all([
      encrypt(tokenResponse.data.refresh_token),
      encrypt(tokenResponse.data.access_token)
    ]);
    
    const updateData = {
      [QUICKBOOKS_FIELD_NAMES.REFRESH_TOKEN]: encryptedRefreshToken,
      [QUICKBOOKS_FIELD_NAMES.ACCESS_TOKEN]: encryptedAccessToken,
      [QUICKBOOKS_FIELD_NAMES.TOKEN_EXPIRY_TIME]: new Date(Date.now() + QUICKBOOKS_DEFAULTS.TOKEN_EXPIRY_MS),
      [QUICKBOOKS_FIELD_NAMES.UPDATED_AT]: new Date()
    };
    
    await GLAccountMaster.update(updateData, { where: { id: quickbookAccount.id } });
    const updatedUser = await GLAccountMaster.findByPk(quickbookAccount.id);
    
    logger.info(QUICKBOOKS_SERVICE_LOGS.TOKENS_REFRESHED_SUCCESS(quickbookAccount.id));
    return updatedUser;
    
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_ADDING_TOKEN, error.message);
    if (error.response) {
      logger.error(QUICKBOOKS_SERVICE_LOGS.QUICKBOOKS_API_ERROR, {
        status: error.response.status,
        data: error.response.data
      });
    }
    return null;
  }
};































// Legacy function aliases for backward compatibility
export const getTokensDirectly = refreshTokens;

export default {
  createKnexInstance,
  retryQuery,
  exchangeAuthCodeForTokens,
  refreshTokens,
  getTokensDirectly
};
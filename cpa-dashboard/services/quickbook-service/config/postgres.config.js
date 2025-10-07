import { Sequelize } from 'sequelize';
import { createLogger } from '../app/utils/logger.utils.js';
import { getDatabaseConfig } from './shared.config.js';

const logger = createLogger('POSTGRES_CONFIG');

const dbConfig = getDatabaseConfig();
const isLocalDatabase = dbConfig.isLocal;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);



// Connection status tracking
let connectionStatus = {
  connected: false,
  lastCheck: null,
  retryCount: 0,
  databaseType: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  isLocal: isLocalDatabase,
  environment: process.env.NODE_ENV,
};

/**
 * Test database connection
 * @returns {Promise<Object>} Connection test result
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    
    // Get PostgreSQL version
    const [results] = await sequelize.query('SELECT version() as version');
    const version = results[0]?.version || 'Unknown';
    
    // Update connection status
    
    connectionStatus.connected = true;
    connectionStatus.lastCheck = new Date();
    connectionStatus.retryCount = 0;
    
    logger.info(`✅ PostgreSQL connection successful`, {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      isLocal: isLocalDatabase,
      version: version.split(' ')[0] + ' ' + version.split(' ')[1] // PostgreSQL version
    });
    
    return {
      success: true,
      message: 'PostgreSQL connection successful',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: version,
      status: {
        type: isLocalDatabase ? 'local' : 'cloud',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        ssl: !!dbConfig.dialectOptions.ssl
      }
    };
  } catch (error) {
    // Update connection status
    connectionStatus.connected = false;
    connectionStatus.lastCheck = new Date();
    connectionStatus.retryCount += 1;
    
    logger.error(`❌ PostgreSQL connection failed`, {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      isLocal: isLocalDatabase,
      error: error.message
    });
    
    return {
      success: false,
      message: 'PostgreSQL connection failed',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error.message,
      status: {
        type: isLocalDatabase ? 'local' : 'cloud',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        ssl: !!dbConfig.dialectOptions.ssl
      }
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
      database: connectionTest.success ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      status: connectionTest.success ? 'healthy' : 'unhealthy',
      connection: connectionTest,
      config: {
        type: isLocalDatabase ? 'local' : 'cloud',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        environment: process.env.NODE_ENV
      }
    };
  } catch (error) {
    return {
      database: 'error',
      timestamp: new Date().toISOString(),
      status: 'error',
      connection: {
        success: false,
        error: error.message
      },
      config: {
        type: isLocalDatabase ? 'local' : 'cloud',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        environment: process.env.NODE_ENV
      }
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
    logger.info('✅ PostgreSQL connection closed successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection close error:', error);
    throw error;
  }
}

/**
 * Initialize database connection
 * @returns {Promise<Object>} Initialization result
 */
async function initializeDatabase() {
  try {
    logger.info(`🔌 Initializing PostgreSQL connection...`, {
      type: isLocalDatabase ? 'LOCAL' : 'CLOUD',
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database
    });
    
    const connectionResult = await testConnection();
    
    if (connectionResult.success) {
      logger.info('✅ PostgreSQL database initialized successfully');
      return connectionResult;
    } else {
      logger.error('❌ PostgreSQL database initialization failed');
      return connectionResult;
    }
  } catch (error) {
    logger.error('❌ PostgreSQL database initialization error:', error);
    throw error;
  }
}



// Sequelize CLI configuration for migrations and seeders
const cliConfig = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
};




export {
  testConnection,
  getConnectionStatus,
  healthCheck,
  closeConnection,
  initializeDatabase,
  isLocalDatabase,
  dbConfig as config
};



// Export sequelize instance as default for models
export default sequelize;

export { cliConfig };

logger.info(`📊 PostgreSQL Configuration Loaded`, {
  type: isLocalDatabase ? 'LOCAL DATABASE' : 'CLOUD DATABASE',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  ssl: !!dbConfig.dialectOptions.ssl,
  environment: process.env.NODE_ENV
});

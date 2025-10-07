


export const QUICKBOOKS_CONTROLLER_LOGS = {
  CONFIG_ERROR: 'QuickBooks configuration error:',
  FOUND_ACCOUNTS: (count) => `Found ${count} QuickBooks accounts`,
  SYNC_FAILED_FOR_ACCOUNT: (accountId, error) => `Sync failed for account ${accountId}: ${error}`,
  SYNC_FAILED_ACCOUNT: (accountId, error) => `Sync failed for account ${accountId}: ${error}`,
};



export const QUICKBOOKS_SERVICE_LOGS = {
  DATABASE_CONNECTION_ERROR: 'Database connection error:',
  ATTEMPTING_RECONNECT: 'Attempting to reconnect to database',
  TOKEN_EXCHANGE_FAILED: 'Token exchange failed:',
  TOKENS_REFRESHED_SUCCESS: (accountId) => `Successfully refreshed tokens for account ID: ${accountId}`,
  QUICKBOOKS_API_ERROR: 'QuickBooks API Error:',
  
  RETRYING_QUERY: (attempt, maxRetries) => `Retrying query (Attempt ${attempt}/${maxRetries})`,
  QUERY_FAILED: (attempt, error) => `Query failed after ${attempt} attempts: ${error}`,
  RETRY_FOR_TOKEN_TABLE: (tableName) => `Retrying request for token refresh for table: ${tableName}`,
  ERROR_FETCHING_DATA: (tableName, error) => `Error fetching data for table ${tableName}: ${error}`,
  
  FILE_SAVED_SUCCESS: (fileName) => `Successfully saved ${fileName} to local storage`,
  FILE_SAVE_ERROR: (fileName, error) => `Error saving ${fileName} to local storage: ${error}`,
  CREATING_TABLE: (tableName) => `Creating table: ${tableName}`,
  NO_DATA_FOR_UPSERT: (tableName) => `No data provided for upsert in table: ${tableName}`,
  BATCH_PROCESSED: (batchNumber, tableName) => `Processed batch ${batchNumber} for table ${tableName}`,
  NO_TABLE_MAPPING: (tableName) => `No table mapping found for table: ${tableName}`,
  NO_DATA_FOUND_TABLE: (tableName) => `No data found for table: ${tableName}`,
  ERROR_PROCESSING_TABLE: (tableName, error) => `Error processing table ${tableName}: ${error}`,
  
  SYNC_LOG_CREATED: (status, initiatedBy, accountId) => 
    `Sync log created: ${status} - initiated by: ${initiatedBy} - account: ${accountId || 'N/A'}`,
  ERROR_CREATING_SYNC_LOG: (error) => `Error creating sync log: ${error}`,
  ERROR_IN_HANDLE_SYNC_FAILURE: (error) => `Error in handleSyncFailure: ${error}`,
};


export const QUICKBOOKS_REPORTS_LOGS = {
  MISSING_REALM_ID: (reportType) => `Missing realm ID for ${reportType}`,
  MISSING_ACCESS_TOKEN: (reportType) => `Missing access token for ${reportType}`,
  MISSING_DATE_RANGE: (reportType) => `Missing date range for ${reportType}`,
  
  PROCESSING_FAILED: (reportType, error, realmId) => 
    `Report processing failed for ${reportType}: ${error} (realmId: ${realmId})`,
  NO_DATA_FOUND: (reportType, realmId) => `No data found for ${reportType} (realmId: ${realmId})`,
  MAPPING_FAILED: (reportType) => `Report data mapping failed for ${reportType}`,
  PROCESSING_START: (reportType, startDate, endDate, realmId) => 
    `Starting report processing for ${reportType} (${startDate} to ${endDate}, realmId: ${realmId})`,
  DATES_VALIDATED: (autoStartDate, autoEndDate) => 
    `Report dates validated - autoStartDate: ${autoStartDate}, autoEndDate: ${autoEndDate}`,
  SAVE_FAILED: (reportType) => `Failed to save report data for ${reportType}`,
  PROCESSING_SUCCESS: (reportType, reportId) => 
    `Report processing completed successfully for ${reportType} (reportId: ${reportId})`,
  RETRIEVAL_FAILED: (reportType, error) => `Failed to retrieve reports for ${reportType}: ${error}`,
  
  FETCH_SUCCESS: (reportName, dataSize) => 
    `Successfully fetched report data for ${reportName} (dataSize: ${dataSize})`,
  API_REQUEST_FAILED: (reportName, error, status) => 
    `API request failed for ${reportName}: ${error} (status: ${status})`,
  RETRY_FOR_TOKEN: 'Retrying request for token refresh',
  RETRY_SUCCESS: (reportName) => `Successfully retried report request for ${reportName}`,
  SAVING_DATA: (reportType, columnsCount, rowsCount) => 
    `Saving report data for ${reportType} (columns: ${columnsCount}, rows: ${rowsCount})`,
  SAVE_SUCCESS: (reportType, reportId, columnsCount, rowsCount) => 
    `Successfully saved report data for ${reportType} (reportId: ${reportId}, columns: ${columnsCount}, rows: ${rowsCount})`,
  FETCHING: (reportName, startDate, endDate, realmId) => 
    `Fetching report data from QuickBooks for ${reportName} (${startDate} to ${endDate}, realmId: ${realmId})`,
  MAPPING_SUCCESS: (reportType, columnsCount, rowsCount) => 
    `Successfully mapped report data for ${reportType} (columns: ${columnsCount}, rows: ${rowsCount})`,
  MAPPING_FAILED: (reportType, error) => `Report data mapping failed for ${reportType}: ${error}`,
};



export const QUICKBOOKS_REPOSITORY_LOGS = {
  ERROR_CHECKING_REALM_ID: (error) => `Error checking realm ID existence: ${error}`,
  CREATE_ERROR: 'Error in create in quickbooks.repository.js:',
  FIND_MANY_ERROR: 'Error in findMany in quickbooks.repository.js:',
  FIND_BY_ID_ERROR: 'Error in findById in quickbooks.repository.js:',
  FIND_BY_REALM_ID_ERROR: 'Error in findByRealmId in quickbooks.repository.js:',
  FIND_BY_ORGANIZATION_ID_ERROR: 'Error in findByOrganizationId in quickbooks.repository.js:',
  FIND_ONE_ERROR: 'Error in findOne in quickbooks.repository.js:',
  UPDATE_BY_ID_ERROR: 'Error in updateById in quickbooks.repository.js:',
  UPDATE_BY_REALM_ID_ERROR: 'Error in updateByRealmId in quickbooks.repository.js:',
  SOFT_DELETE_BY_ID_ERROR: 'Error in softDeleteById in quickbooks.repository.js:',
  FIND_PAGINATED_ERROR: 'Error in findPaginated in quickbooks.repository.js:',
  EXISTS_ERROR: 'Error in exists in quickbooks.repository.js:',
  REALM_ID_EXISTS_ERROR: 'Error in realmIdExists in quickbooks.repository.js:',
  COUNT_ERROR: 'Error in count in quickbooks.repository.js:',
  FIND_ACTIVE_ERROR: 'Error in findActive in quickbooks.repository.js:',
  FIND_BY_STATUS_ERROR: 'Error in findByStatus in quickbooks.repository.js:',
  FIND_WITH_USER_INFO_ERROR: 'Error in findWithUserInfo in quickbooks.repository.js:',
  UPDATE_LAST_SYNCED_ERROR: 'Error in updateLastSynced in quickbooks.repository.js:',
  UPDATE_TOKENS_ERROR: 'Error in updateTokens in quickbooks.repository.js:',
  UPDATE_STATUS_ERROR: 'Error in updateStatus in quickbooks.repository.js:',
  RESTORE_ERROR: 'Error in restore in quickbooks.repository.js:',
  HARD_DELETE_ERROR: 'Error in hardDelete in quickbooks.repository.js:',
  CREATE_MANY_ERROR: 'Error in createMany in quickbooks.repository.js:',
  UPDATE_MANY_ERROR: 'Error in updateMany in quickbooks.repository.js:',
  DELETE_MANY_ERROR: 'Error in deleteMany in quickbooks.repository.js:',
};









export const QUICKBOOKS_VALIDATION_LOGS = {
  VALIDATION_RULES: {
    REALM_ID: (reportType) => `Missing realm ID for ${reportType}`,
    ACCESS_TOKEN: (reportType) => `Missing access token for ${reportType}`,
    DATE_RANGE: (reportType) => `Missing date range for ${reportType}`,
  },
  VALIDATION_FAILED: (field, reportType) => `Validation failed for ${field} in ${reportType}`,
  VALIDATE_REQUIRED_FIELDS_ERROR: 'Error in validateRequiredFields in reports.controller.js:',
  HANDLE_API_ERROR_ERROR: 'Error in handleApiError in reports.controller.js:',
  PROCESS_REPORT_DATA_ERROR: 'Error in processReportData in reports.controller.js:',
  GET_REPORTS_BY_REALM_ID_ERROR: 'Error in getReportsByRealmId in reports.controller.js:',
};



export const QUICKBOOKS_ERROR_LOGS = {
  CONTROLLER_ERROR: 'QuickBooks controller error',
  ERROR_ADDING_ACCOUNT: 'Error adding account',
  ERROR_GETTING_ACCOUNTS: 'Error getting accounts',
  ERROR_ADDING_TOKEN: 'Error adding token',
  ERROR_UPLOADING_FILE: 'Error uploading file',
  ERROR_DISABLING_ACCOUNT: 'Error disabling account',
  INVALID_TOKEN_RESPONSE: 'Invalid token response from QuickBooks',
  SYNC_MAIN_ERROR: 'QuickBooks sync main error',
  VALIDATE_REQUIRED_FIELDS_ERROR: 'Error in validateRequiredFields in quickbooks.controller.js:',
  HANDLE_DATABASE_ERROR_ERROR: 'Error in handleDatabaseError in quickbooks.controller.js:',
  SEND_ERROR_RESPONSE_ERROR: 'Error in sendErrorResponse in quickbooks.controller.js:',
  CREATE_AUTH_HEADER_ERROR: 'Error in createAuthHeader in quickbooks.controller.js:',
  SYNC_ALL_ACCOUNTS_ERROR: 'Error in syncAllQuickBooksAccounts in quickbooks.controller.js:',
  SYNC_ACCOUNT_DATA_ERROR: 'Error in syncAccountData in syncAllQuickBooksAccounts:',
  PROCESS_ORGANIZATION_ERROR: 'Error processing organization in syncAllQuickBooksAccounts:',
  
  // Report-specific error logs
  API_REQUEST_FAILED: (reportName, error, status) => 
    `API request failed for ${reportName}: ${error} (status: ${status})`,
  PROCESSING_FAILED: (reportType, operation) => 
    `Report processing failed for ${reportType}: ${operation}`,
  MAPPING_FAILED: (reportType, error) => 
    `Report data mapping failed for ${reportType}: ${error}`,
  SAVE_FAILED: (reportType) => 
    `Failed to save report data for ${reportType}`,
  RETRIEVAL_FAILED: (reportType, error) => 
    `Failed to retrieve reports for ${reportType}: ${error}`,
};



export const QUICKBOOKS_SUCCESS_LOGS = {
  ADDING_ACCOUNT: 'Adding QuickBooks account',
  GETTING_ACCOUNTS: 'Getting QuickBooks accounts',
  ADDING_TOKEN: 'Adding QuickBooks token',
  GETTING_TOKENS: 'Getting tokens',
  ADDING_FILE: 'Adding file from QuickBooks',
  DISABLING_ACCOUNT: 'Disabling QuickBooks account',
  RETRY_FOR_TOKEN: 'Retrying request for token refresh',
  CREATING_TABLE: (tableName) => `Creating table: ${tableName}`,
};



export const QUICKBOOKS_COMMON_LOGS = {
  ERROR_DESTROYING_CONNECTION: 'Error destroying connection',
  ERROR_DESTROYING_OLD_CONNECTION: 'Error destroying old connection',
  DATA_MUST_BE_ARRAY: 'Data must be an array',
  DATABASE_CONNECTION_NOT_ESTABLISHED: 'Database connection not established',
  FAILED_TO_REFRESH_ACCESS_TOKEN: 'Failed to refresh access token',
  QUICKBOOKS_SYNC_MAIN_ERROR: 'QuickBooks sync main error',
};



export const QUICKBOOKS_SYSTEM_LOGS = {
  CORS_ALLOWING_ORIGIN: 'CORS: Allowing origin',
  CORS_BLOCKING_ORIGIN: 'CORS: Blocking origin',
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
  SERVICE_ENDPOINTS: 'QuickBooks Service Endpoints:',
  SERVICE_READY: 'ready!',
  PORT_IN_USE_ERROR: 'Port is already in use for',
  SERVICE_ERROR: 'error:',
  SERVICE_STARTUP_FAILED: 'startup failed:',
};

export const LOG_DATABASE = {
  INITIALIZE_DATABASE: 'Initializing database connection...',
  INITIALIZE_DATABASE_SUCCESS: 'Database connection initialized successfully',
  INITIALIZE_DATABASE_FAILED: 'Database connection initialization failed',
  CONNECTION_FAILED: 'Database connection failed',
  CONNECTED_TO_DATABASE: 'Connected to database successfully',
  DATABASE_ERROR: 'Database connection error occurred',
  DB_RECONNECT: 'Attempting to reconnect to database',
  QUERY_TRYING: 'Retrying database query',
  NO_ACCOUNTS_FOUND: 'No accounts found in API response',
};


export default {
  QUICKBOOKS_CONTROLLER_LOGS,
  QUICKBOOKS_SERVICE_LOGS,
  QUICKBOOKS_REPORTS_LOGS,
  QUICKBOOKS_REPOSITORY_LOGS,
  QUICKBOOKS_VALIDATION_LOGS,
  QUICKBOOKS_ERROR_LOGS,
  QUICKBOOKS_SUCCESS_LOGS,
  QUICKBOOKS_COMMON_LOGS,
  QUICKBOOKS_SYSTEM_LOGS,
  LOG_DATABASE,
};

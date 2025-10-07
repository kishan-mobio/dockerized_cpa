// ERROR CONSTANTS - Server and System Error Messages

// Server Error Messages
export const SERVER_ERROR_MESSAGES = {
  DATABASE_CONNECTION_FAILED: 'Database connection failed',
  CORS_POLICY_VIOLATION: 'CORS policy violation',
  ORIGIN_NOT_ALLOWED: 'Origin not allowed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  ROUTE_NOT_FOUND: 'Route not found',
  PORT_IN_USE: 'Port is already in use',
  SERVER_START_FAILED: 'Server failed to start',
  SERVER_SHUTDOWN_ERROR: 'Error during server shutdown',
  GRACEFUL_SHUTDOWN_FAILED: 'Graceful shutdown failed',
  UNCAUGHT_EXCEPTION: 'Uncaught exception occurred',
  UNHANDLED_REJECTION: 'Unhandled promise rejection occurred',
};

// Database Error Messages
export const DATABASE_ERROR_MESSAGES = {
  CONNECTION_CLOSE_SUCCESS: 'Database connection closed successfully',
  CONNECTION_CLOSE_ERROR: 'Database connection close error',
  CONNECTION_FAILED: 'Database connection failed',
  CONNECTION_ERROR: 'Database connection failed',
  SAVE_FAILED: 'Failed to save data to database',
  RETRIEVAL_FAILED: 'Failed to retrieve data from database',
  QUERY_ERROR: 'Database query error',
  CONNECTION_NOT_ESTABLISHED: 'Database connection not established',
};



// Default export for backward compatibility
export default {
  SERVER_ERROR_MESSAGES,
  DATABASE_ERROR_MESSAGES,
};
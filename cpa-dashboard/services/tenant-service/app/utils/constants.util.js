export const TENANT_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  EXIST_NAME: "Tenant with this name already exists",
  EXIST_SUBDOMAIN: "Tenant with this subdomain already exists",
  NOT_FOUND: "Tenant not found",
  FETCHED_SUCCESSFULLY: "Tenants fetched successfully",
  TENANT_FETCHED_SUCCESSFULLY: "Tenant fetched successfully",
  CREATED_SUCCESSFULLY: "Tenant created successfully",
  UPDATED_SUCCESSFULLY: "Tenant updated successfully",
  DELETED_SUCCESSFULLY: "Tenant deleted successfully",
  DOES_NOT_EXIST: "Tenant does not exist",
  ALREADY_EXISTS_ERROR:
    "Tenant with the same name or subdomain already exists.",
  TENANT_INFO_RETRIEVED_SUCCESSFULLY: "Tenant info retrieved successfully",
  INVALID_TENANT_ID: "Invalid tenant ID",
  NAME_REQUIRED: "Tenant name is required",
  SUBDOMAIN_REQUIRED: "Subdomain is required",
  NOT_FOUND_OR_DELETED: "Tenant not found or already deleted",
  SUBSCRIPTION_PLAN_REQUIRED: "Subscription plan is required",
  INVALID_SUBSCRIPTION_PLAN_ID: "Invalid subscription plan ID",
};

export const CONFIG_DEFAULTS = {
  NODE_ENV: "development",
  HOST: "localhost",
  PROTOCOL: "http",
  PORT: 8001,
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_NAME: "cpa_dashboard",
  DB_USERNAME: "postgres",
  JWT_EXPIRATION: "24h",
  REFRESH_TOKEN_EXPIRATION: "7d",
  BCRYPT_ROUNDS: 12,
  COOKIE_MAX_AGE: 86400000,
  LOG_LEVEL: "info",
  LOG_FORMAT: "combined",
  LOG_FILE_PATH: "./logs",
  LOG_MAX_SIZE: "20m",
  LOG_MAX_FILES: 14,
  LOG_DIRECTORY: "./logs",
  LOG_DATE_PATTERN: "DD-MM-YYYY",
  LOG_INFO_LEVEL: "info",
  LOG_ERROR_LEVEL: "error",
  LOG_ZIPPED_ARCHIVE: true,
  MONTH_NAMES: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  DB_POOL_MAX: 20,
  DB_POOL_MIN: 5,
  DB_POOL_ACQUIRE: 60000,
  DB_POOL_IDLE: 10000,
};

export const DATE_FORMATS = {
  FORMAT: "DD-MM-YYYY",
  LOG_FORMAT: "YYYY-MM-DD HH:mm:ss",
  ISO_DATE_ONLY: "YYYY-MM-DD",
  ISO_DATETIME: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DISPLAY_FORMAT: "DD-MM-YYYY",
  MOMENT_FORMATS: ["MMM-YY", "MMM YYYY"],
};

export const MODULES = {
  TENANT: "Tenant",
  SUBSCRIPTION_PLAN: "SubscriptionPlan",
  COUNTRY: "Country",
  CURRENCY: "Currency",
  AUTH: "Authentication",
  TOKEN: "Token",
  FILE: "File",
  STORAGE: "Storage",
};

// Operation Names
export const OPERATIONS = {
  CREATE: "create",
  GET_ALL: "getAll",
  GET_BY_ID: "getById",
  UPDATE: "update",
  DELETE: "delete",
  SEARCH: "search",
  COUNT: "count",
  EXISTS: "exists",
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

export const LOGGER_NAMES = {
  TENANT_SERVICE: "TENANT_SERVICE",
  TENANT_CONTROLLER: "TENANT_CONTROLLER",
  DB_UTILS: "DB_UTILS",
  AWS_CONFIG: "AWS_CONFIG",
};

// Tenant Operations
export const LOG_ACTIONS = {
  CREATING: "Creating a new tenant",
  EXISTS_NAME: "Attempt to create tenant with existing name",
  EXISTS_SUBDOMAIN: "Attempt to create tenant with existing subdomain",
  FETCHING_ALL: "Fetching all tenants",
  FETCHING_BY_ID: "Fetching tenant by ID",
  UPDATED_SUCCESS: "Tenant updated successfully",
  FETCHING_BY_NAME: "Fetching tenant by name",
  FETCHING_BY_SUBDOMAIN: "Fetching tenant by subdomain",
  FETCHED_NAME: "Successfully fetched tenant with name",
  FETCHED_SUBDOMAIN: "Successfully fetched tenant with subdomain",
  FETCHED_SUCCESSFULLY: "Tenants fetched successfully",
  DELETED_SUCCESS: "Tenant deleted successfully",
  CREATED_SUCCESS: "Tenant created successfully",
  NOT_FOUND: "Tenant not found",
  NOT_FOUND_NAME: "Tenant with name not found",
  NOT_FOUND_SUBDOMAIN: "Tenant with subdomain not found",
  UPDATING: "Updating tenant",
  DELETING: "Deleting tenant",
  DELETED: "Tenant deleted successfully",
  ALREADY_EXISTS: "Tenant already exists",
  SERVER_STARTED: "Tenant Server started successfully",
  SERVER_ERROR: "Server error occurred",
  SERVER_STARTUP_FAILED: "Server startup failed",
};

export const ERROR_MESSAGES = {
  GENERAL: "Something went wrong!",
  BAD_REQUEST: "Bad request",
  INVALID_CREDENTIALS: "Invalid credentials",
  INTERNAL_ERROR: "Internal error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  TIMEOUT: "Request timeout exceeded",
  TIMEOUT_ERROR: "Request timed out",
  TOKEN_EXPIRED: "TokenExpiredError",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  FORBIDDEN_ACCESS: "Forbidden access",
  RESOURCE_NOT_FOUND: "Resource not found",
  INVALID_REQUEST: "Invalid request",
  MISSING_PARAMETERS: "Missing required parameters",
  INVALID_PARAMETERS: "Invalid parameters",
  UNAUTHORIZED: "Unauthorized",
  DUPLICATE_ENTRY: "Duplicate entry",
  CONFLICT: "Conflict detected",
  VALIDATION_FAILED: "Validation failed",
  DATABASE_ERROR: "Database error",
  PROCESSING_FAILED: "Processing failed",
  OPERATION_FAILED: "Operation failed",
  CONNECTION_FAILED: "Connection failed",
  INITIALIZATION_FAILED: "Initialization failed",
  CLEANUP_FAILED: "Cleanup failed",
  CONFIGURATION_ERROR: "Configuration error",
  NETWORK_ERROR: "Network error",
  SERVICE_UNAVAILABLE: "Service unavailable",
  NOT_IMPLEMENTED: "Not implemented",
  DATABASE_CONNECTION_CLOSE_ERROR: "Error closing database connection",
  DATABASE_CONNECTION_CLOSE_SUCCESS: "Database connection closed successfully",
  FOREIGN_KEY_VALIDATION_ERROR: "Error validating multiple foreign keys",
  SUBSCRIPTION_PLANS_COUNT_ERROR: "Error counting subscription plans",
  COUNTRIES_COUNT_ERROR: "Error counting countries",
  TENANT_PROFILE_ERROR: "Error getting tenant profile",
};

export const LOG_ERRORS = {
  CREATING: "Error creating tenant",
  ACCESS_DENIED: "Access denied. User does not have permission.",
  FETCHING_ALL: "Error fetching tenants",
  FETCHING_BY_ID: "Error fetching tenant by ID",
  FETCHING_BY_NAME: "Error fetching tenant by name",
  FETCHING_BY_SUBDOMAIN: "Error fetching tenant by subdomain",
  UPDATING: "Error updating tenant",
  DELETING: "Error deleting tenant",
};

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  DUPLICATE_ERROR: "DUPLICATE_ERROR",
  FOREIGN_KEY_ERROR: "FOREIGN_KEY_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST_ERROR: "BAD_REQUEST_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  TOKEN_ERROR: "TOKEN_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  DELETE_NOT_ALLOWED: "DELETE_NOT_ALLOWED",
};

export const VALIDATION_MESSAGES = {
  TOKEN_VALIDATION_ERROR: "Token validation error",
  FIELD_REQUIRED: "Field is required",
  INVALID_EMAIL: "Invalid email address",
  INVALID_URL: "Invalid URL",
  INVALID_TOKEN: "Invalid token",
  INVALID_STRING: "Invalid string",
  INVALID_BOOLEAN: "Invalid boolean",
  INVALID_NUMBER: "Invalid number",
  VALIDATION_FAILED: "Validation failed",
  VALIDATION_FAILED_FOR_SOURCE: "Validation failed for {source}",
  VALIDATION_PROCESSING_ERROR: "Validation processing error",
  DATA_SANITIZATION_ERROR: "Data sanitization error",
  REQUIRED_FIELD: (field) => `${field} is required`,
  INVALID_FORMAT: (field) => `${field} format is invalid`,
  INVALID_LENGTH: (field, min, max) =>
    `${field} must be between ${min} and ${max} characters`,
  // Tenant specific validation messages
  TENANT_DATA_REQUIRED: "Tenant data is required",
  TENANT_NAME_REQUIRED: "Tenant name is required",
  TENANT_NAME_MIN_LENGTH: "Tenant name must be at least 2 characters long",
  TENANT_NAME_MAX_LENGTH: "Tenant name must be less than 100 characters",
  TENANT_NAME_CANNOT_BE_EMPTY: "Tenant name cannot be empty",
  TENANT_CANNOT_BE_DELETED: "Tenant cannot be deleted",
  SUBDOMAIN_REQUIRED: "Subdomain is required",
  SUBDOMAIN_MIN_LENGTH: "Subdomain must be at least 3 characters long",
  SUBDOMAIN_MAX_LENGTH: "Subdomain must be less than 50 characters",
  SUBDOMAIN_PATTERN:
    "Subdomain must contain only lowercase letters, numbers, and hyphens",
  ID_REQUIRED: "ID is required",
  ID_MUST_BE_POSITIVE: "ID must be a positive number",
  UPDATE_DATA_REQUIRED: "Update data is required",
  NAME_REQUIRED: "Name is required",
  NAME_LENGTH: "Name must be between 2 and 100 characters",
  NAME_PATTERN: "Name must contain only letters, numbers, and spaces",
  INVALID_UUID: "Invalid UUID",
  // Joi messages
  NAME_MIN: "Name must be at least 2 characters long",
  NAME_MAX: "Name must not exceed 100 characters",
  SUBDOMAIN_JOI: "Please provide a valid subdomain",
  SUBDOMAIN_PATTERN_JOI:
    "Subdomain must contain only lowercase letters, numbers, and hyphens",
};

export const LOG_DATABASE = {
  INITIALIZE_DATABASE: "Initializing database connection...",
  INITIALIZE_DATABASE_SUCCESS: "Database connection initialized successfully",
  INITIALIZE_DATABASE_FAILED: "Database connection initialization failed",
  CONNECTION_FAILED: "Database connection failed",
  CONNECTED_TO_DATABASE: "Connected to database successfully",
  DATABASE_ERROR: "Database connection error occurred",
  DB_RECONNECT: "Attempting to reconnect to database",
  QUERY_TRYING: "Retrying database query",
};

export const REQUEST_BODY_FIELDS = {
  NAME: "name",
  SUBDOMAIN: "subdomain",
  DESCRIPTION: "description",
  SUBSCRIPTION_PLAN_ID: "subscription_plan_id",
  COUNTRY_ID: "country_id",
  CURRENCY_ID: "currency_id",
  SETTINGS: "settings",
  IS_ACTIVE: "is_active",
  ID: "id",
  TENANT_ID: "tenant_id",
};

// Validation Defaults
export const VALIDATION_DEFAULTS = {
  DEFAULT_SOURCE: "body",
  JOIN_SEPARATOR: ".",
  QUOTE_REPLACEMENT: "",
  DEVELOPMENT_MODE: "development",
  USER_AGENT_HEADER: "User-Agent",
  LOG_MESSAGE_FAILED: "Validation failed:",
  LOG_MESSAGE_MIDDLEWARE_ERROR: "Validation middleware error:",
  LOG_MESSAGE_MULTI_FAILED: "Multi-source validation failed:",
  LOG_MESSAGE_MULTI_ERROR: "Multi-validation middleware error:",
};

export const SEQUELIZE_OPERATORS = {
  NE: "ne", // Not equal
  GT: "gt", // Greater than
  GTE: "gte", // Greater than or equal
  LT: "lt", // Less than
  LTE: "lte", // Less than or equal
  LIKE: "like", // Like
  ILIKE: "iLike", // Case insensitive like
  IN: "in", // In array
  NOT_IN: "notIn", // Not in array
  BETWEEN: "between", // Between two values
  NOT_BETWEEN: "notBetween", // Not between two values
  IS_NULL: "is", // Is null
  IS_NOT_NULL: "not", // Is not null
  OR: "or", // OR condition
  AND: "and", // AND condition
};

export const ERROR_CLASS_NAMES = {
  STORAGE_ERROR: "StorageError",
  BAD_REQUEST_ERROR: "BadRequestError",
  VALIDATION_ERROR: "ValidationError",
  DATABASE_ERROR: "DatabaseError",
  UNKNOWN_MODULE: "Unknown",
  SEQUELIZE_UNIQUE_CONSTRAINT_ERROR: "SequelizeUniqueConstraintError",
  SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR: "SequelizeForeignKeyConstraintError",
  SEQUELIZE_VALIDATION_ERROR: "SequelizeValidationError",
  SEQUELIZE_DATABASE_ERROR: "SequelizeDatabaseError",
  SEQUELIZE_CONNECTION_ERROR: "SequelizeConnectionError",
  UNAUTHORIZED_ERROR: "UnauthorizedError",
  FORBIDDEN_ERROR: "ForbiddenError",
  NOT_FOUND_ERROR: "NotFoundError",
};

export const ERROR_DEFAULT_MESSAGES = {
  RESOURCE_ALREADY_EXISTS: "Resource already exists",
  INVALID_FOREIGN_KEY: "Invalid foreign key",
  DATA_VALIDATION_FAILED: "Data validation failed",
  DUPLICATE_ENTRY_DETECTED: "Duplicate entry detected",
  REFERENCE_CONSTRAINT_VIOLATION: "Reference constraint violation",
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  OPERATION_SUCCESSFUL: "Operation successful",
  UNKNOWN_ROUTE: "Unknown Route",
  VALIDATION_FAILED: "Validation failed",
  API_RESOURCE: "API",
  DATABASE_OPERATION: "database operation",
  RESOURCE: "Resource",
  FIELD: "field",
  SOMETHING_WENT_WRONG: "Something went wrong.",
  REFERENCED_RECORD: "referenced record",
  FOREIGN_KEY: "foreign_key",
  OPERATION: "operation",
};

// Server and Application Constants
// SERVER CONSTANTS
export const SERVER_CONSTANTS = {
  SIKKA_SERVER_LABEL: "sikka-server",
  DEFAULT_ALLOWED_ORIGIN: "http://localhost:3000",
  HEALTH_ENDPOINT: "/health",
  API_ENDPOINT: "/api",
  CATCH_ALL_ROUTE: "*",
  ENVIRONMENT_DEVELOPMENT: "development",
};

// SERVER MESSAGES
export const SERVER_MESSAGES = {
  SIKKA_SERVICE_HEALTHY: "Sikka service is healthy",
  ROUTE_NOT_FOUND: "Route not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  SIKKA_SERVICE_STARTED: "Sikka service started on port",
  HEALTH_CHECK_URL: "Health check:",
  API_ENDPOINT_URL: "API endpoint:",
  ENVIRONMENT_INFO: "Environment:",
  SIGTERM_RECEIVED: "SIGTERM received, shutting down gracefully",
  SIGINT_RECEIVED: "SIGINT received, shutting down gracefully",
  PROCESS_TERMINATED: "Process terminated",
  UNHANDLED_ERROR: "Unhandled error:",
  SERVER_STARTED: "Server started successfully",
  SERVER_ERROR: "Server error occurred",
  SERVER_STARTUP_FAILED: "Server startup failed",
  PORT_IN_USE: "Port is already in use",
  ACCESS_URL: "Access URL",
  SERVER_RUNNING: "Server running on port",
};

// Model and Database Field Names
export const MODEL_FIELDS = {
  ID: "id",
  NAME: "name",
  SUBDOMAIN: "subdomain",
  DESCRIPTION: "description",
  SUBSCRIPTION_PLAN_ID: "subscription_plan_id",
  COUNTRY_ID: "country_id",
  CURRENCY_ID: "currency_id",
  SETTINGS: "settings",
  IS_DELETED: "is_deleted",
  IS_ACTIVE: "is_active",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  CREATED_BY: "created_by",
  UPDATED_BY: "updated_by",
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

// Logger Names for Different Components
export const LOGGER_COMPONENT_NAMES = {
  VALIDATION_MIDDLEWARE: "VALIDATION_MIDDLEWARE",
  ERROR_UTILS: "ERROR_UTILS",
};

// Validation Error Types
export const VALIDATION_ERROR_TYPES = {
  VALIDATION_ERROR: "validation_error",
  REQUIRED_FIELD: "required_field",
  INVALID_FORMAT: "invalid_format",
  INVALID_LENGTH: "invalid_length",
};

// Response Status Fields
export const RESPONSE_FIELDS = {
  STATUS: "status",
  MESSAGE: "message",
  DATA: "data",
  SUCCESS: "success",
  ERROR: "error",
  ERRORS: "errors",
  FIELD: "field",
  VALUE: "value",
  TYPE: "type",
  CODE: "code",
  DETAILS: "details",
};

// Environment and Configuration
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  NODE_ENV: "NODE_ENV",
};

// Common Regex Patterns
export const REGEX_PATTERNS = {
  NAME_PATTERN: /^[a-zA-Z0-9\s]+$/,
  SUBDOMAIN_PATTERN: /^[a-z0-9-]+$/,
  SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBERS: /\d/,
};

// Database Table Names
export const TABLE_NAMES = {
  TENANT: "tenant_new",
  SUBSCRIPTION_PLAN: "subscription_plan",
  COUNTRY: "country",
  CURRENCY: "currency",
};

// Database Index Names
export const INDEX_NAMES = {
  UNIQUE_TENANT_NAME: "unique_tenant_name",
  UNIQUE_TENANT_SUBDOMAIN: "unique_tenant_subdomain",
};

// Association Names
export const ASSOCIATION_NAMES = {
  CREATOR: "creator",
  UPDATER: "updater",
  SUBSCRIPTION_PLAN: "subscriptionPlan",
  COUNTRY: "country",
  CURRENCY: "currency",
};

// Error Codes for HTTP Status
export const HTTP_ERROR_CODES = {
  EADDRINUSE: "EADDRINUSE",
};

// Validation Source Types
export const VALIDATION_SOURCES = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
  HEADERS: "headers",
};

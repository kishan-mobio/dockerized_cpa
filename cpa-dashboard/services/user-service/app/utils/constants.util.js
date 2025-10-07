export const USER_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  EXIST_EMAIL: "User with this email already exists",
  EXIST_PHONE: "User with this phone number already exists",
  NOT_FOUND: "User not found",
  FETCHED_SUCCESSFULLY: "Users fetched successfully",
  USER_FETCHED_SUCCESSFULLY: "User fetched successfully",
  CREATED_SUCCESSFULLY: "User created successfully",
  UPDATED_SUCCESSFULLY: "User updated successfully",
  DELETED_SUCCESSFULLY: "User deleted successfully",
  DOES_NOT_EXIST: "User does not exist",
  ALREADY_EXISTS_ERROR:
    "User with the same email or phone number already exists.",
  USER_INFO_RETRIEVED_SUCCESSFULLY: "User info retrieved successfully",
  INVALID_ROLE_ID: "Invalid role ID",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  NAME_REQUIRED: "Name is required",
  INVALID_USER_ID: "Invalid user ID",
  NOT_FOUND_OR_DELETED: "User not found or already deleted",
};

export const CONFIG_DEFAULTS = {
  NODE_ENV: "development",
  HOST: "localhost",
  PROTOCOL: "http",
  PORT: 3000,
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
  QUICKBOOKS_SCOPE: "com.intuit.quickbooks.accounting",
  QUICKBOOKS_RESPONSE_TYPE: "code",
  QUICKBOOKS_ENVIRONMENT_PRODUCTION: "production",
  QUICKBOOKS_ENVIRONMENT_SANDBOX: "sandbox",
  QUICKBOOKS_API_VERSION: "v3",
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
  QUICKBOOKS_API: "YYYY-MM-DD",
  DISPLAY_FORMAT: "DD-MM-YYYY",
  MOMENT_FORMATS: ["MMM-YY", "MMM YYYY"],
};

export const MODULES = {
  USER: "User",
  ROLE: "Role",
  PERMISSION: "Permission",
  ORGANIZATION: "Organization",
  TENANT: "Tenant",
  AUTH: "Authentication",
  TOKEN: "Token",
  FILE: "File",
  STORAGE: "Storage",
  QUICKBOOKS: "QuickBooks",
  REPORTS: "Reports",
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
  USER_SERVICE: "USER_SERVICE",
  USER_CONTROLLER: "USER_CONTROLLER",
  DB_UTILS: "DB_UTILS",
};

// User Operations
export const LOG_ACTIONS = {
  CREATING: "Creating a new user",
  EXISTS_EMAIL: "Attempt to create user with existing email",
  EXISTS_PHONE: "Attempt to create user with existing phone number",
  FETCHING_ALL: "Fetching all users",
  FETCHING_BY_ID: "Fetching user by ID",
  UPDATED_SUCCESS: "User updated successfully",
  UPDATING_PASSWORD: "Updating user password",
  FETCHING_BY_EMAIL: "Fetching user by email",
  FETCHING_BY_PHONE: "Fetching user by phone number",
  FETCHED_EMAIL: "Successfully fetched user with email",
  FETCHED_PHONE: "Successfully fetched user with phone number",
  FETCHED_SUCCESSFULLY: "Users fetched successfully",
  DELETED_SUCCESS: "User deleted successfully",
  CREATED_SUCCESS: "User created successfully",
  NOT_FOUND: "User not found",
  NOT_FOUND_EMAIL: "User with email not found",
  NOT_FOUND_PHONE: "User with phone number not found",
  UPDATING: "Updating user",
  DELETING: "Deleting user",
  DELETED: "User deleted successfully",
  ALREADY_EXISTS: "User already exists",
  SERVER_STARTED: "Server started successfully",
  SERVER_ERROR: "Server error occurred",
  SERVER_STARTUP_FAILED: "Server startup failed",
};

export const ERROR_MESSAGES = {
  GENERAL: "Something went wrong!",
  BAD_REQUEST: "Bad request",
  INVALID_CREDENTIALS: "Invalid email or password",
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
  PERMISSIONS_COUNT_ERROR: "Error counting permissions",
  ORGANIZATIONS_COUNT_ERROR: "Error counting organizations",
  USER_PROFILE_ERROR: "Error getting user profile",
};

export const LOG_ERRORS = {
  CREATING: "Error creating user",
  ACCESS_DENIED: "Access denied. User does not have permission.",
  FETCHING_ALL: "Error fetching users",
  FETCHING_BY_ID: "Error fetching user by ID",
  FETCHING_BY_EMAIL: "Error fetching user by email",
  FETCHING_BY_PHONE: "Error fetching user by phone number",
  UPDATING: "Error updating user",
  FETCHING_ROLE_BY_NAME: "Error fetching role by name",
  FETCHING_ROLE_BY_ID: "Error fetching role by ID",
  DELETING: "Error deleting user",
  UPDATING_LAST_LOGIN: "Error updating user last login",
  UPDATING_PASSWORD: "Error updating user password",
  FETCHING_BY_RESET_PASSWORD_TOKEN:
    "Error fetching user by reset password token",
  VALIDATING_PASSWORD: "Error validating password",
  GENERATING_RESET_PASSWORD_TOKEN: "Error generating reset password token",
  VERIFYING_RESET_PASSWORD_TOKEN: "Error verifying reset password token",
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
  INVALID_PASSWORD_LENGTH: "Password must be between 8 and 15 characters",
  INVALID_PASSWORD_FORMAT:
    "Password must contain at least one alphabet, one number, and one special character",
  INVALID_ROLE_ID: "Invalid role ID provided",
  VALIDATION_FAILED: "Validation failed",
  VALIDATION_FAILED_FOR_SOURCE: "Validation failed for {source}",
  VALIDATION_PROCESSING_ERROR: "Validation processing error",
  DATA_SANITIZATION_ERROR: "Data sanitization error",
  INVALID_EMAIL_FORMAT: "Please provide a valid email address",
  INVALID_PHONE_FORMAT: "Please provide a valid phone number",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  WEAK_PASSWORD:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  REQUIRED_FIELD: (field) => `${field} is required`,
  INVALID_FORMAT: (field) => `${field} format is invalid`,
  INVALID_LENGTH: (field, min, max) =>
    `${field} must be between ${min} and ${max} characters`,
  // Organization specific validation messages
  ORGANIZATION_DATA_REQUIRED: "Organization data is required",
  ORGANIZATION_NAME_REQUIRED: "Organization name is required",
  ORGANIZATION_NAME_MIN_LENGTH:
    "Organization name must be at least 2 characters long",
  ORGANIZATION_NAME_MAX_LENGTH:
    "Organization name must be less than 100 characters",
  ORGANIZATION_NAME_CANNOT_BE_EMPTY: "Organization name cannot be empty",
  ORGANIZATION_CANNOT_BE_DELETED: "Organization cannot be deleted",
  // Permission specific validation messages
  PERMISSION_DATA_REQUIRED: "Permission data is required",
  PERMISSION_NAME_REQUIRED: "Permission name is required",
  PERMISSION_NAME_MIN_LENGTH:
    "Permission name must be at least 2 characters long",
  PERMISSION_NAME_MAX_LENGTH:
    "Permission name must be less than 100 characters",
  PERMISSION_NAME_CANNOT_BE_EMPTY: "Permission name cannot be empty",
  PERMISSION_CANNOT_BE_DELETED: "Permission cannot be deleted",
  ID_REQUIRED: "ID is required",
  ID_MUST_BE_POSITIVE: "ID must be a positive number",
  UPDATE_DATA_REQUIRED: "Update data is required",
  // User validator specific
  NAME_REQUIRED: "Name is required",
  NAME_LENGTH: "Name must be between 2 and 50 characters",
  NAME_PATTERN: "Name must contain only letters and spaces",
  PASSWORD_LENGTH: "Password must be between 8 and 128 characters",
  PASSWORD_COMPLEXITY:
    "Password must contain at least one letter, one number, and one special character",
  SEARCH_QUERY_LENGTH: "Search query must be between 2 and 100 characters",
  INVALID_UUID: "Invalid UUID",
  // Joi messages
  NAME_MIN: "Name must be at least 2 characters long",
  NAME_MAX: "Name must not exceed 50 characters",
  EMAIL_JOI: "Please provide a valid email address",
  PHONE_PATTERN: "Please provide a valid phone number",

  // Added for validate.middleware.js
  EXPRESS_VALIDATION_FAILED: "Express validation failed",
  EXPRESS_VALIDATION_ERROR: "Express validation error",
  JOI_VALIDATION_FAILED: "Joi validation failed",
  JOI_VALIDATION_MIDDLEWARE_ERROR: "Joi validation middleware error",
  MULTI_SOURCE_VALIDATION_FAILED: "Multi-source validation failed",
  MULTI_SOURCE_VALIDATION_ERROR: "Multi-source validation error",
  ASYNC_VALIDATION_ERROR: "Async validation error",
  SANITIZATION_ERROR: "Sanitization error",
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
  NO_ACCOUNTS_FOUND: "No accounts found in API response",
  SYNCHRONIZED_DATABASE: "Database synchronized successfully",
};

export const REQUEST_BODY_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  TOKEN: "token",
  NEW_PASSWORD: "newPassword",
  FILE: "file",
  FILENAME: "filename",
  PHONE: "phone_number",
  TYPE: "type",
  NAME: "name",
  ID: "id",
  URL: "url",
  ROLE_ID: "roleId",
  HEADER: "header",
  BODY: "body",
  USER_ID: "userId",
  ORGANIZATION_ID: "organizationId",
  QUERY: "query",
  FULL_NAME: "full_name",
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

export const SECURITY_PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 30,
  SALT_ROUNDS: 8,
  PREVIOUS_PASSWORDS: 3,
};

export const SECURITY_PASSWORD_MESSAGES = {
  PASSWORD_LENGTH: (min, max) =>
    `Password must be between ${min} and ${max} characters`,
  PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter",
  PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter",
  PASSWORD_NUMBER: "Password must contain at least one number",
  PASSWORD_SPECIAL: "Password must contain at least one special character",
};

export const SECURITY_LOG_PASSWORD = {
  HASH_SUCCESS: "Password hashed successfully",
  HASH_ERROR: "Error hashing password:",
  COMPARE_SUCCESS: "Password comparison successful",
  COMPARE_ERROR: "Error comparing passwords:",
  VALIDATION_ERROR: "Password validation failed:",
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
export const SERVER_MESSAGES = {
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
  EMAIL: "email",
  PASSWORD: "password",
  PASSWORD_HASH: "password_hash",
  FULL_NAME: "full_name",
  PHONE_NUMBER: "phone_number",
  IS_DELETED: "is_deleted",
  IS_ACTIVE: "is_active",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  CREATED_BY: "created_by",
  UPDATED_BY: "updated_by",
  LAST_LOGIN: "last_login",
  TENANT_ID: "tenant_id",
  ORGANIZATION_ID: "organization_id",
  ROLE_ID: "role_id",
  NAME: "name",
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
  PASSWORD_UTILS: "PASSWORD_UTILS",
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
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
  NAME_PATTERN: /^[a-zA-Z\s]+$/,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBERS: /\d/,
};

// Database Table Names
export const TABLE_NAMES = {
  APP_USER: "app_user",
  USERS: "users",
  ROLES: "roles",
  PERMISSIONS: "permissions",
  ORGANIZATIONS: "organizations",
};

// Database Index Names
export const INDEX_NAMES = {
  UNIQUE_EMAIL_PER_TENANT: "unique_email_per_tenant",
};

// Association Names
export const ASSOCIATION_NAMES = {
  CREATOR: "creator",
  UPDATER: "updater",
};

// Error Codes for HTTP Status
export const HTTP_ERROR_CODES = {
  EADDRINUSE: "EADDRINUSE",
};

// QuickBooks Specific Messages
export const QUICKBOOKS_MESSAGES = {
  OPERATION_FAILED: "QuickBooks operation failed",
  AUTH_EXPIRED:
    "QuickBooks authentication expired. Please reconnect your account.",
  RATE_LIMITED: "QuickBooks API rate limit exceeded. Please try again later.",
  SERVICE_UNAVAILABLE:
    "QuickBooks service temporarily unavailable. Please try again later.",
};

// Validation Source Types
export const VALIDATION_SOURCES = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
  HEADERS: "headers",
};

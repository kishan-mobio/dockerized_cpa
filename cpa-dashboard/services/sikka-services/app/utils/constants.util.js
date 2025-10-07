// HYGIENE REAPPOINTMENT CONSTANTS
export const HYGIENE_REAPPOINTMENT_CONSTANTS = {
  ENTITY: "HygieneReappointment",
  HYGIENE_REAPPOINTMENT: "hygiene_reappointment",
  HYGIENE_REAPPOINTMENT_SUCCESS: "Hygiene reappointment fetched successfully",
  HYGIENE_REAPPOINTMENT_FAILED: "Failed to fetch hygiene reappointment",
  HYGIENE_REAPPOINTMENT_FETCHED:
    "Hygiene reappointment fetched and stored successfully",
};
// AVG DAILY PRODUCTION CONSTANTS
export const AVG_DAILY_PRODUCTION_CONSTANTS = {
  ENTITY: "AvgDailyProduction",
};
// NEW PATIENTS CONSTANTS
export const NEW_PATIENTS_CONSTANTS = {
  ENTITY: "NewPatients",
};
// NO SHOW APPOINTMENTS CONSTANTS
export const NO_SHOW_APPOINTMENTS_CONSTANTS = {
  ENTITY: "NoShowAppointments",
};
// TREATMENT PLAN ANALYSIS CONSTANTS
export const TREATMENT_ANALYSIS_CONSTANTS = {
  ENTITY: "TreatmentAnalysis",
};
// SIKKA API CONFIGURATION
export const SIKKA_API = {
  BASE_URL: "https://api.sikkasoft.com",
  VERSION: "v4",
  ENDPOINTS: {
    AUTHORIZED_PRACTICES: "/authorized_practices",
    REQUEST_KEY: "/request_key",
    ACCOUNT_RECEIVABLES: "accounts_receivable",
    TREATMENT_PLAN_ANALYSIS: "treatment_plan_analysis",
    TOTAL_PRODUCTION_PER_DAY: "total_production_per_day",
    TOTAL_PRODUCTION_BY_DENTIST: "total_production_by_dentist",
    TOTAL_PRODUCTION_BY_HYGIENIST: "total_production_by_hygienist",
    AVG_DAILY_PRODUCTION: "average_daily_scheduled_production",
    NO_SHOW_APPOINTMENTS: "no_show_appointments",
    NEW_PATIENTS: "new_patients",
    HYGIENE_REAPPOINTMENT: "hygiene_reappointment",
    DIRECT_RESTORATIONS: "total_direct_restorations_by_provider"
  },
  GRANT_TYPES: {
    REQUEST_KEY: "request_key",
  },
};

// METHOD TYPES
export const METHOD_TYPES = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
};

// SIKKA MESSAGES
export const SIKKA_MESSAGES = {
  REQUEST_KEY_SUCCESS: "Request key generated successfully",
  REQUEST_KEY_FAILED: "Failed to generate request key",
  AUTHORIZED_PRACTICES_SUCCESS: "Authorized practices fetched successfully",
  NO_AUTHORIZED_PRACTICES: "No authorized practices found",
  MISSING_PRACTICE_CREDENTIALS:
    "Missing office_id or secret_key in practice data",
  INVALID_REQUEST_KEY_RESPONSE: "Invalid response from request key API",
  NETWORK_ERROR: "Network error occurred while calling Sikka API",
  INVALID_CREDENTIALS: "Invalid credentials",
  API_CALL_FAILED: "API call failed with status",
  SIKKA_API_ERROR: "Sikka API Error",
  NETWORK_ERROR_OCCURRED: "Network error occurred while calling Sikka API",
  ACCOUNT_RECEIVABLES_SUCCESS: "Account receivables fetched successfully",
  ACCOUNT_RECEIVABLES_FAILED: "Failed to fetch account receivables",
  NO_DATA_RECEIVED: "No data received from API",
};

// MODEL FIELDS
export const MODEL_FIELDS = {
  APP_ID: "app_id",
  APP_KEY: "app_key",
  OFFICE_ID: "office_id",
  SECRET_KEY: "secret_key",
  REQUEST_KEY: "request_key",
  GRANT_TYPE: "grant_type",
  START_TIME: "start_time",
  END_TIME: "end_time",
  EXPIRES_IN: "expires_in",
  EMAIL: "email",
  ITEMS: "items",
  DATA: "data",
};

// VALIDATION RULES
export const VALIDATION_RULES = {
  APP_ID_MIN_LENGTH: 1,
  APP_ID_MAX_LENGTH: 100,
  APP_KEY_MIN_LENGTH: 1,
  APP_KEY_MAX_LENGTH: 255,
};

// VALIDATION MESSAGES
export const VALIDATION_MESSAGES = {
  APP_ID_REQUIRED: "App ID is required",
  APP_ID_LENGTH: "App ID must be between 1 and 100 characters",
  APP_KEY_REQUIRED: "App Key is required",
  APP_KEY_LENGTH: "App Key must be between 1 and 255 characters",
  VALIDATION_FAILED: "Validation failed",
  VALIDATION_PROCESSING_ERROR: "Error processing validation",
  DATA_MUST_BE_ARRAY: "Data must be an array",
  INVALID_DATA_TYPE: "Invalid data type",
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  INVALID_OBJECT: "Invalid object",
};

// LOGGER CONFIGURATION
export const LOGGER_NAMES = {
  SIKKA_CONTROLLER: "sikka-controller",
  SIKKA_SERVICE: "sikka-service",
  VALIDATION_MIDDLEWARE: "validation-middleware",
  KPIS_SERVICE: "kpis-service",
  KPIS_CONTROLLER: "kpis-controller",
};

// LOG ACTIONS
export const LOG_ACTIONS = {
  REQUESTING_KEY: "Requesting API key from Sikka",
  REQUEST_KEY_SUCCESS: "Request key generated successfully",
  REQUEST_KEY_FAILED: "Failed to generate request key",
  FETCHING_PRACTICES: "Fetching authorized practices from Sikka",
  PRACTICES_FETCHED: "Authorized practices fetched successfully",
  PRACTICES_FETCH_FAILED: "Failed to fetch authorized practices",
  REQUEST_KEY_API_FAILED: "Request key API call failed",
  ACCOUNT_RECEIVABLES_SUCCESS: "Account receivables fetched successfully",
  ACCOUNT_RECEIVABLES_FAILED: "Failed to fetch account receivables",
  TREATMENT_ANALYSIS_SUCCESS: "Treatment analysis fetched successfully",
  TREATMENT_ANALYSIS_FAILED: "Failed to fetch treatment analysis",
  NO_SHOW_APPOINTMENTS_SUCCESS: "No show appointments fetched successfully",
  NO_SHOW_APPOINTMENTS_FAILED: "Failed to fetch no show appointments",
  AVG_DAILY_PRODUCTION_SUCCESS: "Avg daily production fetched successfully",
  AVG_DAILY_PRODUCTION_FAILED: "Failed to fetch avg daily production",
  NEW_PATIENTS_SUCCESS: "New patients fetched successfully",
  NEW_PATIENTS_FAILED: "Failed to fetch new patients",
  HYGIENE_REAPPOINTMENT_SUCCESS: "Hygiene reappointment fetched successfully",
  HYGIENE_REAPPOINTMENT_FAILED: "Failed to fetch hygiene reappointment",
  DIRECT_RESTORATIONS_SUCCESS: "Direct restorations fetched successfully",
  DIRECT_RESTORATIONS_FAILED: "Failed to fetch direct restorations",
};

// MODULES AND OPERATIONS
export const MODULES = {
  SIKKA: "sikka",
};

export const OPERATIONS = {
  REQUEST_KEY: "request_key",
  AUTHORIZED_PRACTICES: "authorized_practices",
};

// CONFIGURATION DEFAULTS
export const CONFIG_DEFAULTS = {
  SIKKA_API_TIMEOUT: 30000, // 30 seconds
  REQUEST_KEY_EXPIRY_HOURS: 24, // 24 hours
};

// VALIDATION DEFAULTS
export const VALIDATION_DEFAULTS = {
  DEFAULT_SOURCE: "body",
  LOG_MESSAGE_FAILED: "Validation failed",
  LOG_MESSAGE_MIDDLEWARE_ERROR: "Validation middleware error",
  LOG_MESSAGE_MULTI_FAILED: "Multi-source validation failed",
  LOG_MESSAGE_MULTI_ERROR: "Multi-source validation middleware error",
};

// BUSINESS LOGIC CONSTANTS
export const BUSINESS_CONSTANTS = {
  HTTP_SUCCESS_STATUS: 200,
  CREDENTIAL_SEPARATOR: ", ",
  STRING_TYPE: "string",
};

// HTTP HEADERS
export const HTTP_HEADERS = {
  APP_ID: "App-Id",
  APP_KEY: "App-Key",
  CONTENT_TYPE: "Content-Type",
  APPLICATION_JSON: "application/json",
};

// ERROR MESSAGES FOR VALIDATION
export const ERROR_MESSAGES = {
  APP_ID_REQUIRED_STRING: "App ID is required and must be a string",
  APP_KEY_REQUIRED_STRING: "App Key is required and must be a string",
  API_CALL_FAILED_FOR: "API call failed for authorized practices",
  REQUEST_KEY_API_FAILED: "Request key API failed",
  ACCOUNT_RECEIVABLES_FAILED: "Failed to fetch account receivables",
  TREATMENT_ANALYSIS_FAILED: "Failed to fetch treatment analysis",
};

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
};

// REQUEST CONFIGURATION
export const REQUEST_CONFIG = {
  JSON_LIMIT: "10mb",
  URL_ENCODED_LIMIT: "10mb",
};

export const LOG_DATABASE = {
  INITIALIZE_DATABASE: "Initializing database connection...",
  INITIALIZE_DATABASE_SUCCESS: "Database connection initialized successfully",
  INITIALIZE_DATABASE_FAILED: "Database connection initialization failed",
  CONNECTION_FAILED: "Database connection failed",
  CONNECTED_TO_DATABASE: "Connected to database successfully",
  DATABASE_SYNCHRONIZED: "Database synchronized successfully",
  DATABASE_ERROR: "Database connection error occurred",
  DB_RECONNECT: "Attempting to reconnect to database",
  QUERY_TRYING: "Retrying database query",
  NO_ACCOUNTS_FOUND: "No accounts found in API response",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
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

// SIKKA SPECIFIC CONSTANTS
export const SIKKA_CONSTANTS = {
  REQUEST_KEY_EXPIRED_MESSAGE: "Request key has expired, generating new one",
  REQUEST_KEY_VALID_MESSAGE: "Using existing valid request key",
};

// CONTROLLER MESSAGES
export const CONTROLLER_MESSAGES = {
  REQUEST_KEY_GENERATED: "Request key generated and stored successfully",
  ACCOUNT_RECEIVABLES_FETCHED:
    "Account receivables fetched and stored successfully",
  OPERATION_FAILED: "Operation failed",
  TREATMENT_ANALYSIS_FETCHED:
    "Treatment analysis fetched and stored successfully",
  NO_SHOW_APPOINTMENTS_FETCHED:
    "No show appointments fetched and stored successfully",
  AVG_DAILY_PRODUCTION_FETCHED:
    "Avg daily production fetched and stored successfully",
  NEW_PATIENTS_FETCHED: "New patients fetched and stored successfully",
};

// LOGGER NAMES EXTENSION
export const LOGGER_NAMES_EXTENDED = {
  SIKKA_REPOSITORY: "sikka-repository",
};

// SERVICE LAYER CONSTANTS
export const SERVICE_CONSTANTS = {
  REQUEST_KEY_OPERATION: "request_key_operation",
  ACCOUNT_RECEIVABLES_OPERATION: "account_receivables_operation",
  AUTHORIZED_PRACTICES_OPERATION: "authorized_practices_operation",
};

// API RESPONSE FIELD MAPPINGS
export const API_RESPONSE_FIELDS = {
  REQUEST_KEY: "request_key",
  ISSUED_TO: "issued_to",
  START_TIME: "start_time",
  END_TIME: "end_time",
  EXPIRES_IN: "expires_in",
  ITEMS: "items",
  TREATMENT_ANALYSIS: "treatment_analysis",
  NO_SHOW_APPOINTMENTS: "no_show_appointments",
  AVG_DAILY_PRODUCTION: "avg_daily_production",
  NEW_PATIENTS: "new_patients",
};

// NUMERIC CONSTANTS
export const NUMERIC_CONSTANTS = {
  PRACTICE_ID_DEFAULT: 1,
  RADIX_DECIMAL: 10,
};

// HTTP HEADER CONSTANTS
export const HTTP_HEADER_CONSTANTS = {
  REQUEST_KEY_HEADER: "Request-Key",
};

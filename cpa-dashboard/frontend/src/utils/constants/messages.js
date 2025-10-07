// Centralized Messages for User Interface
export const MESSAGES = {
  // General Success Messages
  SUCCESS: {
    SAVE: "Changes saved successfully",
    CREATE: "Item created successfully",
    UPDATE: "Item updated successfully",
    DELETE: "Item deleted successfully",
    UPLOAD: "File uploaded successfully",
    DOWNLOAD: "File downloaded successfully",
    SYNC: "Data synchronized successfully",
    SUBMIT: "Form submitted successfully",
    COPY: "Copied to clipboard",
    EXPORT: "Data exported successfully",
    IMPORT: "Data imported successfully",
  },

  // General Error Messages
  ERROR: {
    GENERAL: "An error occurred. Please try again.",
    NETWORK: "Network error. Please check your connection.",
    SERVER: "Server error. Please try again later.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "Access denied.",
    NOT_FOUND: "The requested item was not found.",
    TIMEOUT: "Request timed out. Please try again.",
    VALIDATION: "Please check your input and try again.",
    SAVE_FAILED: "Failed to save changes",
    DELETE_FAILED: "Failed to delete item",
    UPLOAD_FAILED: "Failed to upload file",
    DOWNLOAD_FAILED: "Failed to download file",
    SYNC_FAILED: "Failed to synchronize data",
    EXPORT_FAILED: "Failed to export data",
    IMPORT_FAILED: "Failed to import data",
  },

  // Loading States
  LOADING: {
    DEFAULT: "Loading...",
    SAVING: "Saving...",
    DELETING: "Deleting...",
    UPLOADING: "Uploading...",
    DOWNLOADING: "Downloading...",
    SYNCING: "Syncing...",
    PROCESSING: "Processing...",
    SUBMITTING: "Submitting...",
    EXPORTING: "Exporting...",
    IMPORTING: "Importing...",
    FETCHING: "Fetching data...",
    UPDATING: "Updating...",
  },

  // Confirmation Messages
  CONFIRM: {
    DELETE: "Are you sure you want to delete this item?",
    DELETE_MULTIPLE: "Are you sure you want to delete these items?",
    UNSAVED_CHANGES: "You have unsaved changes. Are you sure you want to leave?",
    RESET_FORM: "Are you sure you want to reset the form?",
    CANCEL_OPERATION: "Are you sure you want to cancel this operation?",
    LOGOUT: "Are you sure you want to log out?",
    CLEAR_DATA: "Are you sure you want to clear all data?",
    OVERRIDE: "This will override existing data. Continue?",
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_PHONE: "Please enter a valid phone number",
    INVALID_URL: "Please enter a valid URL",
    INVALID_DATE: "Please enter a valid date",
    INVALID_NUMBER: "Please enter a valid number",
    MIN_LENGTH: "Must be at least {min} characters",
    MAX_LENGTH: "Must be no more than {max} characters",
    PASSWORD_MISMATCH: "Passwords do not match",
    WEAK_PASSWORD: "Password is too weak",
    INVALID_FILE_TYPE: "Invalid file type",
    FILE_TOO_LARGE: "File size is too large",
    DUPLICATE_ENTRY: "This entry already exists",
  },

  // Empty States
  EMPTY: {
    NO_DATA: "No data available",
    NO_RESULTS: "No results found",
    NO_ITEMS: "No items to display",
    NO_FILES: "No files uploaded",
    NO_MESSAGES: "No messages",
    NO_NOTIFICATIONS: "No notifications",
    SEARCH_NO_RESULTS: "No results found for your search",
    FILTER_NO_RESULTS: "No items match your filters",
  },

  // Action Feedback
  FEEDBACK: {
    COPIED: "Copied to clipboard",
    SAVED_DRAFT: "Draft saved",
    AUTO_SAVED: "Auto-saved",
    CHANGES_DETECTED: "Changes detected",
    UP_TO_DATE: "Everything is up to date",
    SYNC_COMPLETE: "Sync complete",
    OPERATION_COMPLETE: "Operation completed",
    PROCESSING_COMPLETE: "Processing complete",
  },

  // Navigation and Actions
  NAVIGATION: {
    BACK: "Go back",
    NEXT: "Next",
    PREVIOUS: "Previous",
    CONTINUE: "Continue",
    FINISH: "Finish",
    SKIP: "Skip",
    RETRY: "Retry",
    REFRESH: "Refresh",
    RELOAD: "Reload page",
  },

  // File Operations
  FILE: {
    UPLOAD_PROMPT: "Click to upload or drag and drop",
    UPLOAD_FORMATS: "Supported formats: {formats}",
    UPLOAD_SIZE_LIMIT: "Maximum file size: {size}",
    PROCESSING: "Processing file...",
    INVALID_FORMAT: "Invalid file format",
    TOO_LARGE: "File is too large",
    UPLOAD_SUCCESS: "File uploaded successfully",
    UPLOAD_ERROR: "Failed to upload file",
    DOWNLOAD_START: "Download started",
    DOWNLOAD_COMPLETE: "Download complete",
  },

  // Search and Filter
  SEARCH: {
    PLACEHOLDER: "Search...",
    NO_RESULTS: "No results found",
    SEARCHING: "Searching...",
    CLEAR_SEARCH: "Clear search",
    SEARCH_RESULTS: "{count} results found",
    FILTER_APPLIED: "Filter applied",
    FILTER_CLEARED: "Filter cleared",
    SORT_APPLIED: "Sort applied",
  },

  // Permissions and Access
  PERMISSIONS: {
    ACCESS_DENIED: "You don't have permission to access this resource",
    INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
    LOGIN_REQUIRED: "Please log in to continue",
    SESSION_EXPIRED: "Your session has expired. Please log in again",
    ACCOUNT_DISABLED: "Your account has been disabled",
    FEATURE_DISABLED: "This feature is currently disabled",
  },

  // System Status
  STATUS: {
    ONLINE: "Online",
    OFFLINE: "Offline",
    CONNECTING: "Connecting...",
    CONNECTED: "Connected",
    DISCONNECTED: "Disconnected",
    SYNCED: "Synced",
    OUT_OF_SYNC: "Out of sync",
    MAINTENANCE: "System maintenance in progress",
    UPDATED: "System updated",
  },

  // Time and Date
  TIME: {
    JUST_NOW: "Just now",
    MINUTES_AGO: "{minutes} minutes ago",
    HOURS_AGO: "{hours} hours ago",
    DAYS_AGO: "{days} days ago",
    WEEKS_AGO: "{weeks} weeks ago",
    MONTHS_AGO: "{months} months ago",
    LAST_UPDATED: "Last updated: {time}",
    NEVER: "Never",
  },
};

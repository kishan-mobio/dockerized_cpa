// Common Constants Shared Across Pages
export const COMMON_CONSTANTS = {
  // Common Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    PENDING: "Pending",
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
    SUSPENDED: "Suspended"
  },
  
  // Common Action Labels
  ACTIONS: {
    ADD: "Add",
    EDIT: "Edit",
    VIEW: "View",
    DELETE: "Delete",
    SAVE: "Save",
    CANCEL: "Cancel",
    SUBMIT: "Submit",
    RESET: "Reset",
    SEARCH: "Search",
    FILTER: "Filter",
    EXPORT: "Export",
    IMPORT: "Import",
    REFRESH: "Refresh",
    BACK: "Back",
    NEXT: "Next",
    PREVIOUS: "Previous",
    CLOSE: "Close"
  },
  
  // Common Filter Options
  FILTERS: {
    ALL: "All",
    ALL_STATUS: "All Status",
    ALL_TYPES: "All Types",
    ALL_ROLES: "All Roles"
  },
  
  // Common Table Headers
  TABLE_HEADERS: {
    ID: "ID",
    NAME: "Name",
    TITLE: "Title",
    DESCRIPTION: "Description",
    STATUS: "Status",
    TYPE: "Type",
    CREATED_AT: "Created",
    UPDATED_AT: "Updated",
    ACTIONS: "Actions",
    EMAIL: "Email",
    PHONE: "Phone",
    ADDRESS: "Address",
    DATE: "Date",
    TIME: "Time"
  },
  
  // Common Messages
  MESSAGES: {
    LOADING: "Loading...",
    NO_DATA: "No data available",
    ERROR: "An error occurred",
    SUCCESS: "Operation completed successfully",
    CONFIRM_DELETE: "Are you sure you want to delete this item?",
    UNSAVED_CHANGES: "You have unsaved changes. Are you sure you want to leave?",
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    INVALID_PHONE: "Please enter a valid phone number",
    PASSWORD_MISMATCH: "Passwords do not match",
    WEAK_PASSWORD: "Password is too weak"
  },
  
  // Common Placeholders
  PLACEHOLDERS: {
    SEARCH: "Search...",
    ENTER_NAME: "Enter name",
    ENTER_EMAIL: "Enter email",
    ENTER_PHONE: "Enter phone number",
    ENTER_ADDRESS: "Enter address",
    SELECT_OPTION: "Select an option",
    CHOOSE_FILE: "Choose file",
    ENTER_DESCRIPTION: "Enter description"
  },
  
  // Common Icons
  ICONS: {
    USERS: "users",
    USER: "user",
    USER_CHECK: "user-check",
    USER_X: "user-x",
    SHIELD: "shield",
    KEY: "key",
    LOCK: "lock",
    UNLOCK: "unlock",
    SETTINGS: "settings",
    BUILDING: "building",
    BUILDING_2: "building-2",
    MAP_PIN: "map-pin",
    CALENDAR: "calendar",
    CLOCK: "clock",
    MAIL: "mail",
    PHONE: "phone",
    GLOBE: "globe",
    DATABASE: "database",
    TRENDING_UP: "trending-up",
    CHECK_CIRCLE: "check-circle",
    X_CIRCLE: "x-circle",
    PLUS: "plus",
    MINUS: "minus",
    EDIT: "edit",
    TRASH: "trash",
    EYE: "eye",
    SEARCH: "search",
    FILTER: "filter"
  },

  // Toast Types
  TOAST_TYPE:{
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
  },
  
  // Common Colors
  COLORS: {
    BLUE: {
      BG: "bg-blue-100",
      TEXT: "text-blue-600",
      BORDER: "border-blue-300"
    },
    GREEN: {
      BG: "bg-green-100", 
      TEXT: "text-green-600",
      BORDER: "border-green-300"
    },
    RED: {
      BG: "bg-red-100",
      TEXT: "text-red-600", 
      BORDER: "border-red-300"
    },
    YELLOW: {
      BG: "bg-yellow-100",
      TEXT: "text-yellow-600",
      BORDER: "border-yellow-300"
    },
    PURPLE: {
      BG: "bg-purple-100",
      TEXT: "text-purple-600",
      BORDER: "border-purple-300"
    },
    GRAY: {
      BG: "bg-gray-100",
      TEXT: "text-gray-600",
      BORDER: "border-gray-300"
    }
  },
  
  // Common Sizes
  SIZES: {
    XS: "xs",
    SM: "sm", 
    MD: "md",
    LG: "lg",
    XL: "xl"
  },
  
  // Common Variants
  VARIANTS: {
    DEFAULT: "default",
    OUTLINE: "outline",
    GHOST: "ghost",
    SOLID: "solid"
  }
};

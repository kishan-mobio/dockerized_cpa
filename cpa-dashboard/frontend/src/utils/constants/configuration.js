// Configuration Page Constants
export const CONFIGURATION_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "System Configuration",
  PAGE_SUBTITLE: "Manage system settings and configurations",
  
  // Section Titles
  SECTIONS: {
    GENERAL: "General Settings",
    EMAIL: "Email Settings",
    SECURITY: "Security Settings"
  },
  
  // Stats Cards
  STATS: {
    GENERAL_SETTINGS: {
      TITLE: "General Settings",
      VALUE: "5",
      ICON: "settings",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600"
    },
    EMAIL_SETTINGS: {
      TITLE: "Email Settings",
      VALUE: "6",
      ICON: "mail",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600"
    },
    SECURITY_SETTINGS: {
      TITLE: "Security Settings",
      VALUE: "5",
      ICON: "shield",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600"
    },
    SYSTEM_STATUS: {
      TITLE: "System Status",
      VALUE: "Online",
      ICON: "database",
      BG_COLOR: "bg-yellow-100",
      ICON_COLOR: "text-yellow-600"
    }
  },
  
  // Form Labels
  LABELS: {
    // General Settings
    SITE_NAME: "Site Name",
    SITE_DESCRIPTION: "Site Description",
    TIMEZONE: "Timezone",
    DATE_FORMAT: "Date Format",
    LANGUAGE: "Language",
    
    // Email Settings
    SMTP_HOST: "SMTP Host",
    SMTP_PORT: "SMTP Port",
    SMTP_USERNAME: "SMTP Username",
    SMTP_PASSWORD: "SMTP Password",
    FROM_EMAIL: "From Email",
    FROM_NAME: "From Name",
    
    // Security Settings
    SESSION_TIMEOUT: "Session Timeout (minutes)",
    PASSWORD_MIN_LENGTH: "Password Minimum Length",
    MAX_LOGIN_ATTEMPTS: "Max Login Attempts",
    REQUIRE_TWO_FACTOR: "Require Two-Factor Authentication",
    ALLOW_PASSWORD_RESET: "Allow Password Reset"
  },
  
  // Default Values
  DEFAULTS: {
    SITE_NAME: "CPA Pro Dashboard",
    SITE_DESCRIPTION: "Professional CPA Management System",
    TIMEZONE: "America/New_York",
    DATE_FORMAT: "MM/DD/YYYY",
    LANGUAGE: "en",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "587",
    FROM_EMAIL: "noreply@cpapro.com",
    FROM_NAME: "CPA Pro",
    SESSION_TIMEOUT: "30",
    PASSWORD_MIN_LENGTH: "8",
    MAX_LOGIN_ATTEMPTS: "5"
  },
  
  // Options
  OPTIONS: {
    TIMEZONES: [
      { value: "America/New_York", label: "Eastern Time" },
      { value: "America/Chicago", label: "Central Time" },
      { value: "America/Denver", label: "Mountain Time" },
      { value: "America/Los_Angeles", label: "Pacific Time" }
    ],
    DATE_FORMATS: [
      { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
      { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
    ],
    LANGUAGES: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" }
    ]
  },
  
  // Button Labels
  BUTTONS: {
    SAVE_GENERAL: "Save General Settings",
    SAVE_EMAIL: "Save Email Settings",
    SAVE_SECURITY: "Save Security Settings",
    SAVE: "Save",
    CANCEL: "Cancel",
    RESET: "Reset"
  },
  
  // Messages
  MESSAGES: {
    SAVE_SUCCESS: "Settings saved successfully",
    SAVE_ERROR: "Error saving settings",
    VALIDATION_ERROR: "Please check your input"
  }
};

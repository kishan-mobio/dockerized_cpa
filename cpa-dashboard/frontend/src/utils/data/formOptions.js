// Common form field options used across different forms
export const FORM_OPTIONS = {
  // Status options
  STATUS: [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ],

  // Extended status options
  EXTENDED_STATUS: [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
    { label: "Draft", value: "Draft" },
    { label: "Suspended", value: "Suspended" },
  ],

  // Organization types
  ORGANIZATION_TYPES: [
    { label: "Department", value: "Department" },
    { label: "Team", value: "Team" },
    { label: "Division", value: "Division" },
    { label: "Branch", value: "Branch" },
  ],

  // User roles
  USER_ROLES: [
    { label: "Super Admin", value: "Super Admin" },
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "User", value: "User" },
    { label: "Editor", value: "Editor" },
    { label: "Viewer", value: "Viewer" },
  ],

  // Role levels
  ROLE_LEVELS: [
    { label: "System", value: "System" },
    { label: "Organization", value: "Organization" },
    { label: "Department", value: "Department" },
    { label: "Team", value: "Team" },
  ],

  // Departments
  DEPARTMENTS: [
    { label: "IT", value: "IT" },
    { label: "Finance", value: "Finance" },
    { label: "HR", value: "HR" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Operations", value: "Operations" },
    { label: "Management", value: "Management" },
    { label: "Legal", value: "Legal" },
    { label: "Support", value: "Support" },
  ],

  // Permission modules
  PERMISSION_MODULES: [
    { label: "User Management", value: "User Management" },
    { label: "Tenant Management", value: "Tenant Management" },
    { label: "Role Management", value: "Role Management" },
    { label: "System Settings", value: "System Settings" },
    { label: "Reports", value: "Reports" },
    { label: "Dashboard", value: "Dashboard" },
  ],

  // Permission types
  PERMISSION_TYPES: [
    { label: "Create", value: "Create" },
    { label: "Read", value: "Read" },
    { label: "Update", value: "Update" },
    { label: "Delete", value: "Delete" },
    { label: "Manage", value: "Manage" },
    { label: "View", value: "View" },
    { label: "Execute", value: "Execute" },
  ],

  // Tenant plans
  TENANT_PLANS: [
    { label: "Basic", value: "Basic" },
    { label: "Professional", value: "Professional" },
    { label: "Enterprise", value: "Enterprise" },
  ],

  // Timezones
  TIMEZONES: [
    { label: "Eastern Time", value: "America/New_York" },
    { label: "Central Time", value: "America/Chicago" },
    { label: "Mountain Time", value: "America/Denver" },
    { label: "Pacific Time", value: "America/Los_Angeles" },
  ],

  // Date formats
  DATE_FORMATS: [
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
  ],

  // Languages
  LANGUAGES: [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
  ],

  // Log levels
  LOG_LEVELS: [
    { label: "Error", value: "error" },
    { label: "Warning", value: "warning" },
    { label: "Info", value: "info" },
    { label: "Debug", value: "debug" },
  ],

  // Backup frequencies
  BACKUP_FREQUENCIES: [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ],

  // Countries (common ones)
  COUNTRIES: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "GB" },
    { label: "Australia", value: "AU" },
    { label: "Germany", value: "DE" },
    { label: "France", value: "FR" },
    { label: "Japan", value: "JP" },
    { label: "India", value: "IN" },
  ],

  // File types
  FILE_TYPES: [
    { label: "PDF", value: "application/pdf" },
    { label: "Word Document", value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { label: "Excel Spreadsheet", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { label: "Image (JPEG)", value: "image/jpeg" },
    { label: "Image (PNG)", value: "image/png" },
    { label: "Text File", value: "text/plain" },
    { label: "CSV", value: "text/csv" },
  ],

  // Priority levels
  PRIORITIES: [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Critical", value: "critical" },
  ],

  // Yes/No options
  YES_NO: [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],

  // Boolean options with string values
  BOOLEAN_STRING: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],

  // Common page sizes for pagination
  PAGE_SIZES: [
    { label: "10", value: 10 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ],

  // Sort orders
  SORT_ORDERS: [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ],

  // Common field types for dynamic forms
  FIELD_TYPES: [
    { label: "Text", value: "text" },
    { label: "Email", value: "email" },
    { label: "Password", value: "password" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Select", value: "select" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Textarea", value: "textarea" },
    { label: "File", value: "file" },
  ],
};

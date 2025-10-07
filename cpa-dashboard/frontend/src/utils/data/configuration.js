export const stats = [
  {
    title: "General Settings",
    value: "5",
    icon: "settings",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Email Settings",
    value: "6",
    icon: "mail",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Security Settings",
    value: "5",
    icon: "shield",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "System Status",
    value: "Online",
    icon: "check-circle",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export const generalFields = [
  {
    name: "siteName",
    label: "Site Name",
    type: "text",
    placeholder: "Enter site name",
    validation: { required: "Site name is required" },
  },
  {
    name: "timezone",
    label: "Timezone",
    type: "select",
    options: [
      { label: "Eastern Time", value: "America/New_York" },
      { label: "Central Time", value: "America/Chicago" },
      { label: "Mountain Time", value: "America/Denver" },
      { label: "Pacific Time", value: "America/Los_Angeles" },
    ],
  },
  {
    name: "dateFormat",
    label: "Date Format",
    type: "select",
    options: [
      { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
      { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
      { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
    ],
  },
  {
    name: "language",
    label: "Language",
    type: "select",
    options: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "French", value: "fr" },
    ],
  },
  {
    name: "siteDescription",
    label: "Site Description",
    type: "textarea",
    colSpan: 2,
    placeholder: "Enter site description",
  },
];

export const emailFields = [
  {
    name: "smtpHost",
    label: "SMTP Host",
    type: "text",
    placeholder: "smtp.gmail.com",
    validation: { required: "SMTP host is required" },
  },
  {
    name: "smtpPort",
    label: "SMTP Port",
    type: "number",
    placeholder: "587",
    validation: { required: "SMTP port is required" },
  },
  {
    name: "smtpUsername",
    label: "SMTP Username",
    type: "text",
    placeholder: "Enter username",
  },
  {
    name: "smtpPassword",
    label: "SMTP Password",
    type: "password",
    placeholder: "Enter password",
  },
  {
    name: "fromEmail",
    label: "From Email",
    type: "email",
    placeholder: "noreply@example.com",
    validation: { required: "From email is required" },
  },
  {
    name: "fromName",
    label: "From Name",
    type: "text",
    placeholder: "Your App Name",
    validation: { required: "From name is required" },
  },
];

export const securityFields = [
  {
    name: "sessionTimeout",
    label: "Session Timeout (minutes)",
    type: "number",
    placeholder: "30",
    validation: { required: "Session timeout is required" },
  },
  {
    name: "passwordMinLength",
    label: "Password Minimum Length",
    type: "number",
    placeholder: "8",
    validation: { required: "Password minimum length is required" },
  },
  {
    name: "maxLoginAttempts",
    label: "Max Login Attempts",
    type: "number",
    placeholder: "5",
    validation: { required: "Max login attempts is required" },
  },
  {
    name: "requireTwoFactor",
    label: "Security Options",
    type: "checkbox",
    placeholder: "Require Two-Factor Authentication",
  },
  {
    name: "allowPasswordReset",
    label: "",
    type: "checkbox",
    placeholder: "Allow Password Reset",
  },
];

export const systemFields = [
  {
    name: "maintenanceMode",
    label: "System Modes",
    type: "checkbox",
    placeholder: "Enable Maintenance Mode",
  },
  {
    name: "debugMode",
    label: "",
    type: "checkbox",
    placeholder: "Enable Debug Mode",
  },
  {
    name: "logLevel",
    label: "Log Level",
    type: "select",
    options: [
      { label: "Error", value: "error" },
      { label: "Warning", value: "warning" },
      { label: "Info", value: "info" },
      { label: "Debug", value: "debug" },
    ],
  },
  {
    name: "backupFrequency",
    label: "Backup Frequency",
    type: "select",
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" },
    ],
  },
  {
    name: "maxFileSize",
    label: "Max File Size (MB)",
    type: "number",
    placeholder: "10",
  },
];

export const notificationFields = [
  {
    name: "emailNotifications",
    label: "Notification Types",
    type: "checkbox",
    placeholder: "Enable Email Notifications",
  },
  {
    name: "smsNotifications",
    label: "",
    type: "checkbox",
    placeholder: "Enable SMS Notifications",
  },
  {
    name: "pushNotifications",
    label: "",
    type: "checkbox",
    placeholder: "Enable Push Notifications",
  },
  {
    name: "notificationFrequency",
    label: "Notification Frequency",
    type: "select",
    options: [
      { label: "Immediate", value: "immediate" },
      { label: "Hourly", value: "hourly" },
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
    ],
  },
];

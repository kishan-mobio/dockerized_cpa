// Tenant Management Page Constants
export const TENANT_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "Tenant Management",
  PAGE_SUBTITLE: "Manage all tenants and their configurations",
  
  // Buttons
  ADD_BUTTON_TEXT: "Add Tenant",
  ADD_BUTTON_PATH: "/masters/tenant/add",
  
  // Search and Filters
  SEARCH_PLACEHOLDER: "Search tenants...",
  
  // Filter Options
  FILTERS: {
    STATUS: {
      ALL: "All Status",
      ACTIVE: "Active",
      INACTIVE: "Inactive"
    },
    PLAN: {
      ALL: "All Plans",
      ENTERPRISE: "Enterprise",
      PROFESSIONAL: "Professional",
      BASIC: "Basic"
    }
  },
  
  // Stats Cards
  STATS: {
    TOTAL_TENANTS: {
      TITLE: "Total Tenants",
      ICON: "building-2",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600"
    },
    ACTIVE: {
      TITLE: "Active",
      ICON: "check-circle",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600"
    },
    INACTIVE: {
      TITLE: "Inactive",
      ICON: "clock",
      BG_COLOR: "bg-yellow-100",
      ICON_COLOR: "text-yellow-600"
    },
    TOTAL_USERS: {
      TITLE: "Total Users",
      ICON: "users",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600"
    }
  },
  
  // Table Headers
  TABLE_HEADERS: {
    TENANT_NAME: "Tenant Name",
    DOMAIN: "Domain",
    STATUS: "Status",
    USERS: "Users",
    PLAN: "Plan",
    CREATED: "Created",
    ACTIONS: "Actions"
  },
  
  // Action Labels
  ACTIONS: {
    EDIT: "Edit",
    VIEW: "View",
    DELETE: "Delete",
    CONFIGURE: "Configure",
    MANAGE_USERS: "Manage Users"
  },
  
  // Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended"
  },
  
  // Plan Types
  PLANS: {
    ENTERPRISE: "Enterprise",
    PROFESSIONAL: "Professional",
    BASIC: "Basic",
    TRIAL: "Trial"
  },
  
  // Sample Tenant Names
  TENANT_NAMES: {
    ACME_CORP: "Acme Corporation",
    TECHSTART: "TechStart Inc",
    GLOBAL_SOLUTIONS: "Global Solutions"
  },
  
  // Sample Domains
  DOMAINS: {
    ACME: "acme.com",
    TECHSTART: "techstart.com",
    GLOBAL: "globalsol.com"
  },
  
  // Add Page
  ADD_PAGE: {
    HEADING: "Add New Tenant",
    SUBTITLE: "Create a new tenant organization",
    BACK_LABEL: "Back to Tenants",
    TITLE: "Tenant Information",
    SUBMIT_LABEL: "Create Tenant"
  },
  
  // Edit Page
  EDIT_PAGE: {
    HEADING: "Edit Tenant",
    SUBTITLE: "Update tenant information",
    BACK_LABEL: "Back to Tenants",
    TITLE: "Tenant Information",
    SUBMIT_LABEL: "Update Tenant"
  },
  
  // View Page
  VIEW_PAGE: {
    HEADING: "View Tenant",
    SUBTITLE: "Tenant details and information",
    BACK_LABEL: "Back to Tenants",
    TITLE: "Tenant Information"
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND_TITLE: "Tenant Not Found",
    NOT_FOUND_MESSAGE: "The requested tenant could not be found."
  },
  
  // Delete Modal
  DELETE_MODAL: {
    TITLE: "Delete Tenant",
    DESCRIPTION: "Are you sure you want to delete this tenant? This action cannot be undone and will remove all associated data."
  }
};

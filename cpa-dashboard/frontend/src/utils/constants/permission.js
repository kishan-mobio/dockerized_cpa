// Permission Management Page Constants
export const PERMISSION_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "Permission Management",
  PAGE_SUBTITLE: "Manage system permissions and access controls",
  
  // Buttons
  ADD_BUTTON_TEXT: "Add Permission",
  ADD_BUTTON_PATH: "/masters/permission/add",
  
  // Search and Filters
  SEARCH_PLACEHOLDER: "Search permissions...",
  
  // Filter Options
  FILTERS: {
    MODULE: {
      ALL: "All",
      USER_MANAGEMENT: "User Management",
      TENANT_MANAGEMENT: "Tenant Management",
      ROLE_MANAGEMENT: "Role Management",
      SYSTEM_SETTINGS: "System Settings"
    },
    TYPE: {
      ALL: "All",
      CREATE: "Create",
      READ: "Read",
      UPDATE: "Update",
      DELETE: "Delete",
      MANAGE: "Manage"
    }
  },
  
  // Stats Cards
  STATS: {
    TOTAL_PERMISSIONS: {
      TITLE: "Total Permissions",
      ICON: "key",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600"
    },
    ACTIVE_PERMISSIONS: {
      TITLE: "Active Permissions",
      ICON: "shield",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600"
    },
    MODULES: {
      TITLE: "Modules",
      ICON: "settings",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600"
    },
    PERMISSION_TYPES: {
      TITLE: "Permission Types",
      ICON: "lock",
      BG_COLOR: "bg-yellow-100",
      ICON_COLOR: "text-yellow-600"
    }
  },
  
  // Table Headers
  TABLE_HEADERS: {
    PERMISSION_NAME: "Permission Name",
    DESCRIPTION: "Description",
    MODULE: "Module",
    TYPE: "Type",
    ROLES: "Roles",
    STATUS: "Status",
    ACTIONS: "Actions"
  },
  
  // Action Labels
  ACTIONS: {
    EDIT: "Edit",
    ASSIGN: "Assign",
    VIEW: "View",
    DELETE: "Delete"
  },
  
  // Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive"
  },
  
  // Permission Types
  TYPES: {
    CREATE: "Create",
    READ: "Read",
    UPDATE: "Update",
    DELETE: "Delete",
    MANAGE: "Manage"
  },
  
  // Modules
  MODULES: {
    USER_MANAGEMENT: "User Management",
    TENANT_MANAGEMENT: "Tenant Management",
    ROLE_MANAGEMENT: "Role Management",
    SYSTEM_SETTINGS: "System Settings"
  },
  
  // Sample Permission Names
  PERMISSION_NAMES: {
    USER_CREATE: "user.create",
    USER_READ: "user.read",
    USER_UPDATE: "user.update",
    USER_DELETE: "user.delete",
    TENANT_MANAGE: "tenant.manage"
  },
  
  // Sample Descriptions
  DESCRIPTIONS: {
    USER_CREATE: "Create new users",
    USER_READ: "View user information",
    USER_UPDATE: "Update user information",
    USER_DELETE: "Delete users",
    TENANT_MANAGE: "Manage tenant settings"
  },
  
  // Add Page
  ADD_PAGE: {
    HEADING: "Add New Permission",
    SUBTITLE: "Create a new system permission",
    BACK_LABEL: "Back to Permissions",
    TITLE: "Permission Information",
    SUBMIT_LABEL: "Create Permission"
  },
  
  // Edit Page
  EDIT_PAGE: {
    HEADING: "Edit Permission",
    SUBTITLE: "Update permission information",
    BACK_LABEL: "Back to Permissions",
    TITLE: "Permission Information",
    SUBMIT_LABEL: "Update Permission"
  },
  
  // View Page
  VIEW_PAGE: {
    HEADING: "View Permission",
    SUBTITLE: "Permission details and information",
    BACK_LABEL: "Back to Permissions",
    TITLE: "Permission Information"
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND_TITLE: "Permission Not Found",
    NOT_FOUND_MESSAGE: "The requested permission could not be found."
  },
  
  // Delete Modal
  DELETE_MODAL: {
    TITLE: "Delete Permission",
    DESCRIPTION: "Are you sure you want to delete this permission? This action cannot be undone and will affect all roles using this permission."
  }
};

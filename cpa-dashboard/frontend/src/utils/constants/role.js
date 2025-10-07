// Role Management Page Constants
export const ROLE_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "Role Management",
  PAGE_SUBTITLE: "Manage user roles and access levels",
  
  // Buttons
  ADD_BUTTON_TEXT: "Add Role",
  ADD_BUTTON_PATH: "/masters/role/add",
  
  // Search and Filters
  SEARCH_PLACEHOLDER: "Search roles...",
  
  // Stats Cards
  STATS: {
    TOTAL_ROLES: {
      TITLE: "Total Roles",
      ICON: "shield",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600"
    },
    TOTAL_USERS: {
      TITLE: "Total Users",
      ICON: "users",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600"
    },
    MAX_PERMISSIONS: {
      TITLE: "Max Permissions",
      ICON: "key",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600"
    },
    ACTIVE_ROLES: {
      TITLE: "Active Roles",
      ICON: "settings",
      BG_COLOR: "bg-yellow-100",
      ICON_COLOR: "text-yellow-600"
    }
  },
  
  // Table Headers
  TABLE_HEADERS: {
    ROLE_NAME: "Role Name",
    DESCRIPTION: "Description",
    PERMISSIONS: "Permissions",
    USERS: "Users",
    STATUS: "Status",
    CREATED: "Created",
    ACTIONS: "Actions"
  },
  
  // Action Labels
  ACTIONS: {
    EDIT: "Edit",
    PERMISSIONS: "Permissions",
    VIEW: "View",
    DELETE: "Delete"
  },
  
  // Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive"
  },
  
  // Role Types
  ROLE_TYPES: {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin", 
    MANAGER: "Manager",
    USER: "User"
  },
  
  // Sample Role Descriptions
  DESCRIPTIONS: {
    SUPER_ADMIN: "Full system access and control",
    ADMIN: "Administrative access to tenant resources",
    MANAGER: "Management level access",
    USER: "Basic user access"
  },
  
  // Add Page
  ADD_PAGE: {
    HEADING: "Add New Role",
    SUBTITLE: "Create a new role with specific permissions",
    BACK_LABEL: "Back to Roles",
    TITLE: "Role Information",
    SUBMIT_LABEL: "Create Role"
  },
  
  // Edit Page
  EDIT_PAGE: {
    HEADING: "Edit Role",
    SUBTITLE: "Update role information",
    BACK_LABEL: "Back to Roles",
    TITLE: "Role Information",
    SUBMIT_LABEL: "Update Role"
  },
  
  // View Page
  VIEW_PAGE: {
    HEADING: "View Role",
    SUBTITLE: "Role details and information",
    BACK_LABEL: "Back to Roles",
    TITLE: "Role Information"
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND_TITLE: "Role Not Found",
    NOT_FOUND_MESSAGE: "The requested role could not be found."
  },
  
  // Delete Modal
  DELETE_MODAL: {
    TITLE: "Delete Role",
    DESCRIPTION: "Are you sure you want to delete this role? This action cannot be undone and will affect all users assigned to this role."
  }
};

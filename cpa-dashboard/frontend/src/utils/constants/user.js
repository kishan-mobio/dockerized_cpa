// User Management Page Constants
import { ROUTES } from "./routes.js";

export const USER_CONSTANTS = {
  // Page Information
  PAGE_TITLE: "User Management",
  PAGE_SUBTITLE: "Manage all users and their access permissions",

  // Buttons
  ADD_BUTTON_TEXT: "Add User",
  ADD_BUTTON_PATH: ROUTES.MASTERS.USER.ADD,

  // Search and Filters
  SEARCH_PLACEHOLDER: "Search users...",

  // Filter Options
  FILTERS: {
    STATUS: {
      ALL: "All Status",
      ACTIVE: "Active",
      INACTIVE: "Inactive",
    },
    ROLE: {
      ALL: "All Roles",
      ADMIN: "Admin",
      MANAGER: "Manager",
      USER: "User",
    },
  },

  // Stats Cards
  STATS: {
    TOTAL_USERS: {
      TITLE: "Total Users",
      ICON: "users",
      BG_COLOR: "bg-blue-100",
      ICON_COLOR: "text-blue-600",
    },
    ACTIVE_USERS: {
      TITLE: "Active Users",
      ICON: "user-check",
      BG_COLOR: "bg-green-100",
      ICON_COLOR: "text-green-600",
    },
    INACTIVE_USERS: {
      TITLE: "Inactive Users",
      ICON: "user-x",
      BG_COLOR: "bg-red-100",
      ICON_COLOR: "text-red-600",
    },
    ADMINS: {
      TITLE: "Admins",
      ICON: "shield",
      BG_COLOR: "bg-purple-100",
      ICON_COLOR: "text-purple-600",
    },
  },

  // Table Headers
  TABLE_HEADERS: {
    NAME: "Name",
    EMAIL: "Email",
    ROLE: "Role",
    STATUS: "Status",
    TENANT: "Tenant",
    LAST_LOGIN: "Last Login",
    ACTIONS: "Actions",
  },

  // Action Labels
  ACTIONS: {
    EDIT: "Edit",
    VIEW: "View",
    DELETE: "Delete",
    ACTIVATE: "Activate",
    DEACTIVATE: "Deactivate",
  },

  // Status Values
  STATUS: {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
  },

  // Role Values
  ROLES: {
    ADMIN: "Admin",
    MANAGER: "Manager",
    USER: "User",
  },

  // Add Page
  ADD_PAGE: {
    HEADING: "Add New User",
    SUBTITLE: "Create a new user account",
    BACK_LABEL: "Back to Users",
    TITLE: "User Information",
    SUBMIT_LABEL: "Create User",
  },

  // Edit Page
  EDIT_PAGE: {
    HEADING: "Edit User",
    SUBTITLE: "Update user information",
    BACK_LABEL: "Back to Users",
    TITLE: "User Information",
    SUBMIT_LABEL: "Update User",
  },

  // View Page
  VIEW_PAGE: {
    HEADING: "View User",
    SUBTITLE: "User details and information",
    BACK_LABEL: "Back to Users",
    TITLE: "User Information",
  },

  // Error Messages
  ERROR_MESSAGES: {
    NOT_FOUND_TITLE: "User Not Found",
    NOT_FOUND_MESSAGE: "The requested user could not be found.",
  },

  // Delete Modal
  DELETE_MODAL: {
    TITLE: "Delete User",
    DESCRIPTION:
      "Are you sure you want to delete this user? This action cannot be undone and will remove all user data and access.",
  },
};

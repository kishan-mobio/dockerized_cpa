export const ROUTES = {
  // Authentication routes
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  // Main application routes
  DASHBOARD: "/dashboard",
  LISTING: "/listing",
  SETTINGS: "/settings",

  // Masters routes
  MASTERS: {
    BASE: "/masters",
    TENANT: {
      LIST: "/masters/tenant",
      ADD: "/masters/tenant/add",
      EDIT: "/masters/tenant/edit",
      VIEW: "/masters/tenant/view",
    },
    ORGANIZATION: {
      LIST: "/masters/org",
      ADD: "/masters/org/add",
      EDIT: "/masters/org/edit",
      VIEW: "/masters/org/view",
    },
    USER: {
      LIST: "/masters/user",
      ADD: "/masters/user/add",
      EDIT: "/masters/user/edit",
      VIEW: "/masters/user/view",
    },
    ROLE: {
      LIST: "/masters/role",
      ADD: "/masters/role/add",
      EDIT: "/masters/role/edit",
      VIEW: "/masters/role/view",
    },
    PERMISSION: {
      LIST: "/masters/permission",
      ADD: "/masters/permission/add",
      EDIT: "/masters/permission/edit",
      VIEW: "/masters/permission/view",
    },
    CONFIGURATION: {
      LIST: "/masters/configuration",
      EDIT: "/masters/configuration/edit",
    },
  },

  // Other feature routes
  BOOK_CLOSURE: "/book-closure",
  APPOINTMENTS: "/appointments",
  MESSAGES: "/messages",
  REPORTS: "/report",
  STAFF_UTILIZATION: "/staff-utilization",

  // API routes (if needed for frontend)
  API: {
    BASE: "/api",
    AUTH: {
      LOGIN: "/api/auth/login",
      SIGNUP: "/api/auth/signup",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
    },
    USERS: "/api/users",
    TENANTS: "/api/tenants",
    ORGANIZATIONS: "/api/organizations",
    ROLES: "/api/roles",
    PERMISSIONS: "/api/permissions",
  },
};

// Helper functions for dynamic routes
export const getEditRoute = (baseRoute, id) => `${baseRoute}/edit/${id}`;
export const getViewRoute = (baseRoute, id) => `${baseRoute}/view/${id}`;
export const getDeleteRoute = (baseRoute, id) => `${baseRoute}/delete/${id}`;

// Route builders for masters
export const MASTERS_ROUTES = {
  tenant: {
    list: () => ROUTES.MASTERS.TENANT.LIST,
    add: () => ROUTES.MASTERS.TENANT.ADD,
    edit: (id) => getEditRoute(ROUTES.MASTERS.TENANT.LIST, id),
    view: (id) => getViewRoute(ROUTES.MASTERS.TENANT.LIST, id),
  },
  organization: {
    list: () => ROUTES.MASTERS.ORGANIZATION.LIST,
    add: () => ROUTES.MASTERS.ORGANIZATION.ADD,
    edit: (id) => getEditRoute(ROUTES.MASTERS.ORGANIZATION.LIST, id),
    view: (id) => getViewRoute(ROUTES.MASTERS.ORGANIZATION.LIST, id),
  },
  user: {
    list: () => ROUTES.MASTERS.USER.LIST,
    add: () => ROUTES.MASTERS.USER.ADD,
    edit: (id) => getEditRoute(ROUTES.MASTERS.USER.LIST, id),
    view: (id) => getViewRoute(ROUTES.MASTERS.USER.LIST, id),
  },
  role: {
    list: () => ROUTES.MASTERS.ROLE.LIST,
    add: () => ROUTES.MASTERS.ROLE.ADD,
    edit: (id) => getEditRoute(ROUTES.MASTERS.ROLE.LIST, id),
    view: (id) => getViewRoute(ROUTES.MASTERS.ROLE.LIST, id),
  },
  permission: {
    list: () => ROUTES.MASTERS.PERMISSION.LIST,
    add: () => ROUTES.MASTERS.PERMISSION.ADD,
    edit: (id) => getEditRoute(ROUTES.MASTERS.PERMISSION.LIST, id),
    view: (id) => getViewRoute(ROUTES.MASTERS.PERMISSION.LIST, id),
  },
};

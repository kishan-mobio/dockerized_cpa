// Navigation Constants
import { ROUTES } from "./routes.js";

export const NAVIGATION_CONSTANTS = {
  // Main Navigation Items
  MAIN_MENU: {
    DASHBOARD: {
      LABEL: "Dashboard",
      PATH: ROUTES.LISTING,
      ICON: "pie-chart",
    },
    MASTERS: {
      LABEL: "Masters",
      ICON: "bar-chart",
      SUBMENU: [
        { label: "Tenant", path: ROUTES.MASTERS.TENANT.LIST },
        { label: "Organization", path: ROUTES.MASTERS.ORGANIZATION.LIST },
        { label: "User", path: ROUTES.MASTERS.USER.LIST },
        { label: "Role", path: ROUTES.MASTERS.ROLE.LIST },
        { label: "Permission", path: ROUTES.MASTERS.PERMISSION.LIST },
        { label: "Configuration", path: ROUTES.MASTERS.CONFIGURATION.LIST },
      ],
    },
    SETTINGS: {
      LABEL: "Settings",
      PATH: ROUTES.SETTINGS,
      ICON: "settings",
    },
  },

  // Sidebar Configuration
  SIDEBAR: {
    LOGO: {
      SRC: "/logo.png",
      ALT: "BG Advisors CPA Logo",
      WIDTH: 64,
      HEIGHT: 64,
    },
    COLORS: {
      PRIMARY: "#3843A4",
      SECONDARY: "#4953B8",
      HOVER: "#6C63FF",
      ACTIVE: "#6C63FF",
      TEXT: "#FFFFFF",
    },
  },

  // Dashboard Sidebar
  DASHBOARD_SIDEBAR: {
    MONTHS: ["May", "June", "July"],
    BACK_BUTTON_TEXT: "Back to Listing",
    DOWNLOAD_BUTTON_TEXT: "Download Dashboard",
    OPERATIONS_TAB: "Operations",
    FINANCIAL_TAB: "Financial",
    PAGE_PREFIX: "Page",
  },

  // Breadcrumb Configuration
  BREADCRUMB: {
    HOME: "Home",
    SEPARATOR: "/",
  },

  // Menu States
  STATES: {
    OPEN: "open",
    CLOSED: "closed",
    ACTIVE: "active",
    INACTIVE: "inactive",
  },

  // Responsive Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },

  // Animation Durations
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
  },

  // Z-Index Values
  Z_INDEX: {
    SIDEBAR: 10,
    DROPDOWN: 20,
    MODAL: 30,
    TOOLTIP: 40,
  },
};

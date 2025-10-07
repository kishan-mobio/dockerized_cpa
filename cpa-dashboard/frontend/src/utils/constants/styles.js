// Component Styling Constants
import { THEME } from "./theme.js";

export const COMPONENT_STYLES = {
  // Button Styles
  BUTTON: {
    BASE: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2",
    
    VARIANTS: {
      PRIMARY: `bg-[${THEME.BRAND.PRIMARY}] text-white shadow-md hover:bg-[${THEME.BRAND.HOVER}] focus:ring-[${THEME.BRAND.PRIMARY}]/20`,
      SECONDARY: `bg-[${THEME.BRAND.SECONDARY}] text-white shadow-md hover:bg-[${THEME.BRAND.HOVER}] focus:ring-[${THEME.BRAND.SECONDARY}]/20`,
      OUTLINE: `border border-[${THEME.BRAND.PRIMARY}] text-[${THEME.BRAND.PRIMARY}] bg-white shadow-md hover:bg-gray-50 focus:ring-[${THEME.BRAND.PRIMARY}]/20`,
      GHOST: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500/20",
      DESTRUCTIVE: `bg-[${THEME.COLORS.ERROR.DEFAULT}] text-white shadow-md hover:bg-[${THEME.COLORS.ERROR[600]}] focus:ring-[${THEME.COLORS.ERROR.DEFAULT}]/20`,
      LINK: `text-[${THEME.BRAND.PRIMARY}] underline-offset-4 hover:underline focus:ring-[${THEME.BRAND.PRIMARY}]/20`,
    },

    SIZES: {
      SM: "h-8 px-3 py-1.5 text-xs rounded-md",
      MD: "h-9 px-4 py-2 text-sm",
      LG: "h-10 px-6 py-2.5 text-base rounded-lg",
      XL: "h-12 px-8 py-3 text-lg rounded-lg",
      ICON: "h-9 w-9 p-0",
    },
  },

  // Input Styles
  INPUT: {
    BASE: "w-full border border-gray-300 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
    
    VARIANTS: {
      DEFAULT: `focus:ring-[${THEME.BRAND.PRIMARY}] focus:ring-opacity-20`,
      ERROR: `border-[${THEME.COLORS.ERROR.DEFAULT}] focus:ring-[${THEME.COLORS.ERROR.DEFAULT}] focus:ring-opacity-20`,
      SUCCESS: `border-[${THEME.COLORS.SUCCESS.DEFAULT}] focus:ring-[${THEME.COLORS.SUCCESS.DEFAULT}] focus:ring-opacity-20`,
    },

    SIZES: {
      SM: "h-8 px-2 text-sm",
      MD: "h-10 px-3 text-sm",
      LG: "h-12 px-4 text-base",
    },
  },

  // Badge Styles
  BADGE: {
    BASE: "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    
    VARIANTS: {
      DEFAULT: `bg-[${THEME.BRAND.PRIMARY}] text-white`,
      SECONDARY: "bg-gray-100 text-gray-800",
      SUCCESS: `bg-[${THEME.COLORS.SUCCESS[100]}] text-[${THEME.COLORS.SUCCESS[700]}]`,
      WARNING: `bg-[${THEME.COLORS.WARNING[100]}] text-[${THEME.COLORS.WARNING[700]}]`,
      ERROR: `bg-[${THEME.COLORS.ERROR[100]}] text-[${THEME.COLORS.ERROR[700]}]`,
      INFO: `bg-[${THEME.COLORS.INFO[100]}] text-[${THEME.COLORS.INFO[700]}]`,
      OUTLINE: `border border-[${THEME.COLORS.BORDER.DEFAULT}] text-gray-700 bg-white`,
    },

    SIZES: {
      SM: "px-2 py-0.5 text-xs",
      MD: "px-2.5 py-0.5 text-xs",
      LG: "px-3 py-1 text-sm",
    },
  },

  // Card Styles
  CARD: {
    BASE: "bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200",
    
    VARIANTS: {
      DEFAULT: "hover:shadow-md",
      ELEVATED: "shadow-md hover:shadow-lg",
      FLAT: "shadow-none border-gray-100",
      INTERACTIVE: "hover:shadow-md cursor-pointer hover:border-gray-300",
    },

    PADDING: {
      SM: "p-3",
      MD: "p-4",
      LG: "p-6",
      XL: "p-8",
    },
  },

  // Modal Styles
  MODAL: {
    OVERLAY: "fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 z-50",
    CONTAINER: "fixed inset-0 z-50 flex items-center justify-center p-4",
    CONTENT: "bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto",
    
    SIZES: {
      SM: "max-w-sm",
      MD: "max-w-md", 
      LG: "max-w-lg",
      XL: "max-w-xl",
      "2XL": "max-w-2xl",
      FULL: "max-w-full mx-4",
    },
  },

  // Table Styles
  TABLE: {
    CONTAINER: "overflow-x-auto",
    TABLE: "min-w-full divide-y divide-gray-200",
    HEADER: "bg-gray-50",
    HEADER_CELL: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
    BODY: "bg-white divide-y divide-gray-200",
    ROW: "hover:bg-gray-50 transition-colors duration-150",
    CELL: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
  },

  // Status Styles
  STATUS: {
    ACTIVE: `bg-[${THEME.COLORS.SUCCESS[100]}] text-[${THEME.COLORS.SUCCESS[700]}] border border-[${THEME.COLORS.SUCCESS[300]}]`,
    INACTIVE: `bg-[${THEME.COLORS.GRAY[100]}] text-[${THEME.COLORS.GRAY[700]}] border border-[${THEME.COLORS.GRAY[300]}]`,
    PENDING: `bg-[${THEME.COLORS.WARNING[100]}] text-[${THEME.COLORS.WARNING[700]}] border border-[${THEME.COLORS.WARNING[300]}]`,
    ERROR: `bg-[${THEME.COLORS.ERROR[100]}] text-[${THEME.COLORS.ERROR[700]}] border border-[${THEME.COLORS.ERROR[300]}]`,
    DRAFT: `bg-[${THEME.COLORS.INFO[100]}] text-[${THEME.COLORS.INFO[700]}] border border-[${THEME.COLORS.INFO[300]}]`,
  },

  // Role Styles
  ROLE: {
    "SUPER_ADMIN": `bg-[${THEME.COLORS.ERROR[100]}] text-[${THEME.COLORS.ERROR[800]}]`,
    "ADMIN": `bg-[${THEME.COLORS.INFO[100]}] text-[${THEME.COLORS.INFO[800]}]`,
    "MANAGER": `bg-[${THEME.COLORS.WARNING[100]}] text-[${THEME.COLORS.WARNING[800]}]`,
    "USER": `bg-[${THEME.COLORS.SUCCESS[100]}] text-[${THEME.COLORS.SUCCESS[800]}]`,
    "EDITOR": `bg-[${THEME.COLORS.INFO[100]}] text-[${THEME.COLORS.INFO[800]}]`,
    "VIEWER": `bg-[${THEME.COLORS.GRAY[100]}] text-[${THEME.COLORS.GRAY[800]}]`,
  },

  // Form Styles
  FORM: {
    GROUP: "space-y-4",
    LABEL: "block text-sm font-medium text-gray-700 mb-1",
    HELP_TEXT: "text-sm text-gray-500 mt-1",
    ERROR_TEXT: `text-sm text-[${THEME.COLORS.ERROR.DEFAULT}] mt-1`,
    SUCCESS_TEXT: `text-sm text-[${THEME.COLORS.SUCCESS.DEFAULT}] mt-1`,
  },

  // Navigation Styles
  NAVIGATION: {
    SIDEBAR: {
      CONTAINER: `h-screen shadow-lg w-64 flex flex-col bg-[${THEME.BRAND.PRIMARY}]`,
      ITEM: "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-lg mb-2 focus:outline-none focus:ring-2 focus:ring-white/40",
      ITEM_ACTIVE: `bg-[${THEME.BRAND.ACCENT}] text-white shadow-lg font-bold`,
      ITEM_INACTIVE: `text-white bg-transparent hover:bg-[${THEME.BRAND.ACCENT}]/80`,
    },

    BREADCRUMB: {
      CONTAINER: "flex items-center space-x-2 text-sm text-gray-500",
      ITEM: "hover:text-gray-700 transition-colors duration-150",
      SEPARATOR: "text-gray-400",
      CURRENT: "text-gray-900 font-medium",
    },
  },

  // Loading Styles
  LOADING: {
    SPINNER: "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
    SKELETON: "animate-pulse bg-gray-200 rounded",
    OVERLAY: "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center",
  },

  // Toast Styles
  TOAST: {
    CONTAINER: "max-w-lg w-full bg-white shadow-lg rounded-lg pointer-events-auto border overflow-hidden",
    SUCCESS: `border-l-4 border-l-[${THEME.COLORS.SUCCESS.DEFAULT}]`,
    ERROR: `border-l-4 border-l-[${THEME.COLORS.ERROR.DEFAULT}]`,
    WARNING: `border-l-4 border-l-[${THEME.COLORS.WARNING.DEFAULT}]`,
    INFO: `border-l-4 border-l-[${THEME.COLORS.INFO.DEFAULT}]`,
  },
};

// Layout Constants
export const LAYOUT = {
  CONTAINER: {
    SM: "max-w-sm mx-auto px-4",
    MD: "max-w-md mx-auto px-4",
    LG: "max-w-4xl mx-auto px-4",
    XL: "max-w-6xl mx-auto px-4",
    "2XL": "max-w-7xl mx-auto px-4",
    FULL: "w-full px-4",
  },

  GRID: {
    COLS_1: "grid grid-cols-1 gap-4",
    COLS_2: "grid grid-cols-1 md:grid-cols-2 gap-4",
    COLS_3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
    COLS_4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
    COLS_6: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
  },

  FLEX: {
    CENTER: "flex items-center justify-center",
    BETWEEN: "flex items-center justify-between",
    START: "flex items-center justify-start",
    END: "flex items-center justify-end",
    COL: "flex flex-col",
    COL_CENTER: "flex flex-col items-center justify-center",
  },

  SPACING: {
    SECTION: "py-8 md:py-12 lg:py-16",
    COMPONENT: "mb-6",
    ELEMENT: "mb-4",
  },
};

// Animation Classes
export const ANIMATIONS = {
  FADE_IN: "animate-in fade-in duration-200",
  FADE_OUT: "animate-out fade-out duration-200",
  SLIDE_IN_UP: "animate-in slide-in-from-bottom-4 duration-300",
  SLIDE_IN_DOWN: "animate-in slide-in-from-top-4 duration-300",
  SLIDE_IN_LEFT: "animate-in slide-in-from-left-4 duration-300",
  SLIDE_IN_RIGHT: "animate-in slide-in-from-right-4 duration-300",
  SCALE_IN: "animate-in zoom-in-95 duration-200",
  SCALE_OUT: "animate-out zoom-out-95 duration-200",
  BOUNCE: "animate-bounce",
  PULSE: "animate-pulse",
  SPIN: "animate-spin",
};

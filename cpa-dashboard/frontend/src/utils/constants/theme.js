// Design System Theme Constants
export const THEME = {
  // Brand Colors
  BRAND: {
    PRIMARY: "#3843A4",
    SECONDARY: "#4953B8", 
    ACCENT: "#6C63FF",
    HOVER: "#5053C8",
  },

  // Semantic Colors
  COLORS: {
    // Status Colors
    SUCCESS: {
      50: "#F0FDF4",
      100: "#DCFCE7", 
      500: "#22C55E",
      600: "#16A34A",
      700: "#15803D",
      DEFAULT: "#22C55E",
    },
    WARNING: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      500: "#F59E0B", 
      600: "#D97706",
      700: "#B45309",
      DEFAULT: "#F59E0B",
    },
    ERROR: {
      50: "#FEF2F2",
      100: "#FEE2E2",
      500: "#EF4444",
      600: "#DC2626", 
      700: "#B91C1C",
      DEFAULT: "#EF4444",
    },
    INFO: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8", 
      DEFAULT: "#3B82F6",
    },

    // Neutral Colors
    GRAY: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB", 
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
      DEFAULT: "#6B7280",
    },

    // Background Colors
    BACKGROUND: {
      PRIMARY: "#FFFFFF",
      SECONDARY: "#F9FAFB",
      TERTIARY: "#F3F4F6",
      DARK: "#141329",
      OVERLAY: "rgba(0, 0, 0, 0.5)",
    },

    // Text Colors
    TEXT: {
      PRIMARY: "#111827",
      SECONDARY: "#4B5563", 
      TERTIARY: "#6B7280",
      MUTED: "#9CA3AF",
      INVERSE: "#FFFFFF",
      LINK: "#3B82F6",
      LINK_HOVER: "#2563EB",
    },

    // Border Colors
    BORDER: {
      DEFAULT: "#E5E7EB",
      LIGHT: "#F3F4F6",
      DARK: "#D1D5DB",
      FOCUS: "#3B82F6",
      ERROR: "#EF4444",
    },
  },

  // Typography
  TYPOGRAPHY: {
    FONT_FAMILY: {
      SANS: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      MONO: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas"],
    },

    FONT_SIZE: {
      XS: "0.75rem",    // 12px
      SM: "0.875rem",   // 14px  
      BASE: "1rem",     // 16px
      LG: "1.125rem",   // 18px
      XL: "1.25rem",    // 20px
      "2XL": "1.5rem",  // 24px
      "3XL": "1.875rem", // 30px
      "4XL": "2.25rem", // 36px
      "5XL": "3rem",    // 48px
    },

    FONT_WEIGHT: {
      LIGHT: "300",
      NORMAL: "400", 
      MEDIUM: "500",
      SEMIBOLD: "600",
      BOLD: "700",
      EXTRABOLD: "800",
    },

    LINE_HEIGHT: {
      TIGHT: "1.25",
      NORMAL: "1.5", 
      RELAXED: "1.75",
      LOOSE: "2",
    },

    LETTER_SPACING: {
      TIGHT: "-0.025em",
      NORMAL: "0em",
      WIDE: "0.025em",
      WIDER: "0.05em",
    },
  },

  // Spacing Scale
  SPACING: {
    0: "0",
    1: "0.25rem",   // 4px
    2: "0.5rem",    // 8px
    3: "0.75rem",   // 12px
    4: "1rem",      // 16px
    5: "1.25rem",   // 20px
    6: "1.5rem",    // 24px
    8: "2rem",      // 32px
    10: "2.5rem",   // 40px
    12: "3rem",     // 48px
    16: "4rem",     // 64px
    20: "5rem",     // 80px
    24: "6rem",     // 96px
    32: "8rem",     // 128px
  },

  // Border Radius
  RADIUS: {
    NONE: "0",
    SM: "0.125rem",   // 2px
    DEFAULT: "0.25rem", // 4px
    MD: "0.375rem",   // 6px
    LG: "0.5rem",     // 8px
    XL: "0.75rem",    // 12px
    "2XL": "1rem",    // 16px
    "3XL": "1.5rem",  // 24px
    FULL: "9999px",
  },

  // Shadows
  SHADOW: {
    SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    XL: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    INNER: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    NONE: "none",
  },

  // Z-Index Scale
  Z_INDEX: {
    HIDE: -1,
    AUTO: "auto",
    BASE: 0,
    DOCKED: 10,
    DROPDOWN: 1000,
    STICKY: 1100,
    BANNER: 1200,
    OVERLAY: 1300,
    MODAL: 1400,
    POPOVER: 1500,
    SKIPLINK: 1600,
    TOAST: 1700,
    TOOLTIP: 1800,
  },

  // Breakpoints
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px", 
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },

  // Animation & Transitions
  ANIMATION: {
    DURATION: {
      FAST: "150ms",
      DEFAULT: "200ms", 
      SLOW: "300ms",
      SLOWER: "500ms",
    },

    EASING: {
      DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      IN: "cubic-bezier(0.4, 0, 1, 1)",
      OUT: "cubic-bezier(0, 0, 0.2, 1)",
      IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Component Sizes
  COMPONENT_SIZES: {
    XS: "xs",
    SM: "sm",
    MD: "md", 
    LG: "lg",
    XL: "xl",
  },

  // Component Variants
  VARIANTS: {
    DEFAULT: "default",
    PRIMARY: "primary",
    SECONDARY: "secondary", 
    OUTLINE: "outline",
    GHOST: "ghost",
    LINK: "link",
    DESTRUCTIVE: "destructive",
  },
};

// CSS Custom Properties for dynamic theming
export const CSS_VARIABLES = {
  // Brand Colors
  "--color-brand-primary": THEME.BRAND.PRIMARY,
  "--color-brand-secondary": THEME.BRAND.SECONDARY,
  "--color-brand-accent": THEME.BRAND.ACCENT,
  "--color-brand-hover": THEME.BRAND.HOVER,

  // Background Colors
  "--color-bg-primary": THEME.COLORS.BACKGROUND.PRIMARY,
  "--color-bg-secondary": THEME.COLORS.BACKGROUND.SECONDARY,
  "--color-bg-tertiary": THEME.COLORS.BACKGROUND.TERTIARY,

  // Text Colors
  "--color-text-primary": THEME.COLORS.TEXT.PRIMARY,
  "--color-text-secondary": THEME.COLORS.TEXT.SECONDARY,
  "--color-text-muted": THEME.COLORS.TEXT.MUTED,

  // Border Colors
  "--color-border-default": THEME.COLORS.BORDER.DEFAULT,
  "--color-border-focus": THEME.COLORS.BORDER.FOCUS,

  // Spacing
  "--spacing-xs": THEME.SPACING[1],
  "--spacing-sm": THEME.SPACING[2], 
  "--spacing-md": THEME.SPACING[4],
  "--spacing-lg": THEME.SPACING[6],
  "--spacing-xl": THEME.SPACING[8],

  // Border Radius
  "--radius-sm": THEME.RADIUS.SM,
  "--radius-md": THEME.RADIUS.MD,
  "--radius-lg": THEME.RADIUS.LG,

  // Shadows
  "--shadow-sm": THEME.SHADOW.SM,
  "--shadow-md": THEME.SHADOW.MD,
  "--shadow-lg": THEME.SHADOW.LG,
};

// Utility functions for theme usage
export const getThemeColor = (colorPath) => {
  const keys = colorPath.split('.');
  let value = THEME.COLORS;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

export const getThemeValue = (path) => {
  const keys = path.split('.');
  let value = THEME;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

// Authentication Page Constants
export const AUTH_CONSTANTS = {
  // Page Titles and Headers
  LOGIN: {
    PAGE_TITLE: "Login",
    PAGE_SUBTITLE: "Sign in to your CPA dashboard",
    FORM_TITLE: "Welcome Back",
    FORM_SUBTITLE: "Please sign in to your account",
  },

  SIGNUP: {
    PAGE_TITLE: "Sign Up",
    PAGE_SUBTITLE: "Create your CPA dashboard account",
    FORM_TITLE: "Create Account",
    FORM_SUBTITLE: "Get started with your CPA dashboard",
  },

  FORGOT_PASSWORD: {
    PAGE_TITLE: "Forgot Password",
    PAGE_SUBTITLE: "Reset your password",
    FORM_TITLE: "Reset Password",
    FORM_SUBTITLE: "Enter your email to receive reset instructions",
  },

  RESET_PASSWORD: {
    PAGE_TITLE: "Reset Password",
    PAGE_SUBTITLE: "Create a new password",
    FORM_TITLE: "New Password",
    FORM_SUBTITLE: "Enter your new password",
  },

  // Form Labels
  LABELS: {
    EMAIL: "Email / Username",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
    REMEMBER_ME: "Remember me",
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    COMPANY_NAME: "Company Name",
    PHONE: "Phone Number",
  },

  // Placeholders
  PLACEHOLDERS: {
    EMAIL: "Enter your email or username",
    PASSWORD: "Enter your password",
    CONFIRM_PASSWORD: "Confirm your password",
    FIRST_NAME: "Enter your first name",
    LAST_NAME: "Enter your last name",
    COMPANY_NAME: "Enter your company name",
    PHONE: "Enter your phone number",
  },

  // Button Text
  BUTTONS: {
    LOGIN: "Log In",
    SIGNUP: "Sign Up",
    FORGOT_PASSWORD: "Forgot Password?",
    RESET_PASSWORD: "Reset Password",
    BACK_TO_LOGIN: "Back to Login",
    SEND_RESET_LINK: "Send Reset Link",
    SIGNING_IN: "Signing In...",
    CREATING_ACCOUNT: "Creating Account...",
    SENDING: "Sending...",
    RESETTING: "Resetting...",
  },

  // Validation Messages
  VALIDATION: {
    EMAIL_REQUIRED: "Please fill in all required fields",
    INVALID_EMAIL: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MISMATCH: "Passwords do not match",
    WEAK_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    FIRST_NAME_REQUIRED: "First name is required",
    LAST_NAME_REQUIRED: "Last name is required",
    COMPANY_NAME_REQUIRED: "Company name is required",
    PHONE_REQUIRED: "Phone number is required",
    INVALID_PHONE: "Please enter a valid phone number",
  },

  // Success Messages
  SUCCESS: {
    LOGIN: "Successfully logged in",
    SIGNUP: "Account created successfully",
    PASSWORD_RESET_SENT: "Password reset link sent to your email",
    PASSWORD_RESET: "Password reset successfully",
    LOGOUT: "Successfully logged out",
  },

  // Error Messages
  ERRORS: {
    LOGIN_FAILED: "Invalid email or password",
    SIGNUP_FAILED: "Failed to create account",
    EMAIL_EXISTS: "Email already exists",
    NETWORK_ERROR: "Network error. Please try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    INVALID_TOKEN: "Invalid or expired reset token",
    PASSWORD_RESET_FAILED: "Failed to reset password",
    ACCOUNT_DEACTIVATED: "Account is deactivated",
    TOO_MANY_ATTEMPTS: "Too many login attempts. Please try again later.",
    SESSION_EXPIRED: "Session expired",
    FAILED_TO_LOAD_PROFILE: "Failed to load profile",
    UPDATE_FAILED: "Update failed",
    PASSWORD_CHANGE_FAILED: "Password change failed",
    FAILED_TO_SEND_RESET_EMAIL: "Failed to send reset email",
    LOGOUT_FAILED: "Failed to logout",
  },

  // Links and Navigation
  LINKS: {
    SIGNUP: "Don't have an account? Sign up",
    LOGIN: "Already have an account? Sign in",
    FORGOT_PASSWORD: "Forgot your password?",
    TERMS: "Terms of Service",
    PRIVACY: "Privacy Policy",
  },

  // Support and Contact
  SUPPORT: {
    NEED_HELP: "Need help? Contact support at",
    EMAIL: "support@getondata.com",
    SSL_MESSAGE: "Secure login protected by SSL encryption",
  },

  // Company Branding
  BRANDING: {
    COMPANY_NAME: "BG ADVISORS CPA, LTD.",
    POWERED_BY: "Powered by",
    PROVIDER: "GetOnData Solutions",
    LOGO_ALT: "BG ADVISORS CPA, LTD.",
    PROVIDER_LOGO_ALT: "BG Advisors CPA Logo",
  },

  // Loading States
  LOADING: {
    SIGNING_IN: "Signing in...",
    CREATING_ACCOUNT: "Creating account...",
    SENDING_RESET: "Sending reset link...",
    RESETTING_PASSWORD: "Resetting password...",
    VERIFYING: "Verifying...",
  },

  // Form Validation Patterns
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },

  // Image Assets
  IMAGES: {
    LOGO: "/logo.png",
    LOGIN_ILLUSTRATION: "/login.png",
    BACKGROUND: "/bg.jpg",
    PROVIDER_LOGO: "/GetOnData.png",
  },
};

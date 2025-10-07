// AUTH SERVICE CONSTANTS - Core Authentication Configuration

// Authentication Messages
export const AUTH_MESSAGES = {
  // Success Messages
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  INVITE_SENT: 'Invite sent successfully',
  SIGNUP_SUCCESS: 'Signup successful',
  PASSWORD_CHANGED_SUCCESS: 'Password changed successfully',
  EMAIL_VERIFIED_SUCCESS: 'Email verified successfully',
  MFA_SETUP_SUCCESS: 'MFA setup successful',
  MFA_VERIFY_SUCCESS: 'MFA verification successful',
  
  // Error Messages
  TOKEN_REQUIRED: 'Token is required',
  TOKEN_REVOKED: 'Token has been revoked',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_INACTIVE: 'Account is inactive',
  INVALID_MFA_CODE: 'Invalid MFA code',
  INVALID_INVITE_TOKEN: 'Invalid or expired invite token',
  INVALID_EMAIL_VERIFICATION_TOKEN: 'Invalid or expired email verification token',
  INVALID_TEMP_TOKEN: 'Invalid temporary token',
  INVALID_CURRENT_PASSWORD: 'Current password is incorrect',
  MFA_REQUIRED: 'MFA verification required',
};

// Token Log Messages
export const TOKEN_LOG_ACTIONS = {
  ACCESS_TOKEN_CREATED: 'Access token created',
  REFRESH_TOKEN_CREATED: 'Refresh token created',
  RESET_TOKEN_CREATED: 'Reset token created',
  INVITE_TOKEN_CREATED: 'Invite token created',
  EMAIL_VERIFICATION_TOKEN_CREATED: 'Email verification token created',
  TOKEN_REVOKED: 'Token revoked',
  ALL_TOKENS_REVOKED: 'All tokens revoked',
  TOKENS_REVOKED_BY_TYPE: 'Tokens revoked by type',
  EXPIRED_TOKENS_CLEANED: 'Expired tokens cleaned',
  USER_TOKENS_FETCHED: 'User tokens fetched',
  TOKEN_STATS_FETCHED: 'Token statistics fetched',
};

export const TOKEN_LOG_ERRORS = {
  ACCESS_TOKEN_CREATION_FAILED: 'Access token creation failed',
  REFRESH_TOKEN_CREATION_FAILED: 'Refresh token creation failed',
  RESET_TOKEN_CREATION_FAILED: 'Reset token creation failed',
  INVITE_TOKEN_CREATION_FAILED: 'Invite token creation failed',
  EMAIL_VERIFICATION_TOKEN_CREATION_FAILED: 'Email verification token creation failed',
  TOKEN_VALIDATION_ERROR: 'Token validation error',
  TOKEN_NOT_FOUND: 'Token not found',
  INVALID_TOKEN_TYPE: 'Invalid token type',
  TOKEN_REVOCATION_FAILED: 'Token revocation failed',
  BULK_REVOCATION_FAILED: 'Bulk token revocation failed',
  TYPE_REVOCATION_FAILED: 'Type revocation failed',
  TOKEN_CLEANUP_FAILED: 'Token cleanup failed',
  TOKEN_FETCH_FAILED: 'Token fetch failed',
  TOKEN_STATS_FAILED: 'Token statistics fetch failed',
  JWT_VALIDATION_ERROR: 'JWT validation error',
};

export const TOKEN_LOG_VALIDATION = {
  TOKEN_VALIDATION_START: 'Token validation started',
  TOKEN_VALIDATION_SUCCESS: 'Token validation successful',
  JWT_VALIDATION_SUCCESS: 'JWT validation successful',
};

export default {
  AUTH_MESSAGES,
  TOKEN_LOG_ACTIONS,
  TOKEN_LOG_ERRORS,
  TOKEN_LOG_VALIDATION,
};

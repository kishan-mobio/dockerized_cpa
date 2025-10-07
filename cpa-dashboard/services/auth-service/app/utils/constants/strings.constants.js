// HARDCODED STRINGS - Essential Constants for Auth Service

export const HARDCODED_STRINGS = {
  // HTTP Headers
  USER_AGENT: 'user-agent',
  AUTHORIZATION: 'authorization',
  BEARER: 'Bearer',
  
  // Cookie Names
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  
  // Token Types
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    ALL: 'all',
    BEARER: 'Bearer',
  },
  
  // HTTP Methods
  HTTP_METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
  },
  
  // Request Body Fields
  REQUEST_FIELDS: {
    REFRESH_TOKEN: 'refresh_token',
    TOKEN_TYPE: 'tokenType',
    TOKEN_ID: 'tokenId',
    TOKEN: 'token',
    EMAIL: 'email',
    PASSWORD: 'password',
    MFA_CODE: 'mfaCode',
    INVITE_TOKEN: 'inviteToken',
    NAME: 'name',
    PHONE_NUMBER: 'phone_number',
    ROLE_ID: 'role_id',
    ORGANIZATION_ID: 'organization_id',
    TENANT_ID: 'tenant_id',
    INVITED_BY: 'invitedBy',
    INVITER_NAME: 'inviterName',
    EMAIL_VERIFICATION_TOKEN: 'emailVerificationToken',
    URL: 'url',
    NEW_PASSWORD: 'newPassword',
    CONFIRM_PASSWORD: 'confirmPassword',
    CURRENT_PASSWORD: 'currentPassword',
    UPDATES: 'updates',
    REQUESTER_ID: 'requesterId',
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    CONTROLLER_ERROR: 'Controller error in',
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  },
  
  // Database Fields
  DB_FIELDS: {
    ID: 'id',
    EMAIL: 'email',
    PASSWORD: 'password',
    PASSWORD_HASH: 'password_hash',
    NAME: 'name',
    FULL_NAME: 'full_name',
    PHONE_NUMBER: 'phone_number',
    ROLE_ID: 'role_id',
    ORGANIZATION_ID: 'organization_id',
    TENANT_ID: 'tenant_id',
    INVITED_BY: 'invited_by',
    INVITED_AT: 'invited_at',
    IS_ACTIVE: 'is_active',
    EMAIL_VERIFIED: 'email_verified',
    EMAIL_VERIFIED_AT: 'email_verified_at',
    MFA_SECRET: 'mfa_secret',
    MFA_ENABLED: 'mfa_enabled',
    MFA_BACKUP_CODES: 'mfa_backup_codes',
    LAST_LOGIN: 'last_login',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    REVOKED: 'revoked',
    USED: 'used',
    REVOKED_AT: 'revoked_at',
    TOKEN_TYPE: 'token_type',
    USER_ID: 'user_id',
    TOKEN_HASH: 'token_hash',
    REFRESH_TOKEN: 'refreshToken',
    REFRESH_TOKEN_EXPIRES_AT: 'refreshTokenExpiresAt',
    RESET_TOKEN: 'resetToken',
    RESET_TOKEN_EXPIRES_AT: 'resetTokenExpiresAt',
    INVITE_TOKEN: 'inviteToken',
    INVITE_TOKEN_EXPIRES_AT: 'inviteTokenExpiresAt',
    EMAIL_VERIFICATION_TOKEN: 'emailVerificationToken',
    EMAIL_VERIFICATION_TOKEN_EXPIRES_AT: 'emailVerificationTokenExpiresAt',
    METADATA: 'metadata',
    CREATED_BY: 'createdBy',
  },
  
  // JWT Configuration
  JWT: {
    MFA_TEMP_TYPE: 'mfa_temp',
  },
  
  // JWT Configuration
  JWT_CONFIG: {
    EXPIRES_IN_15M: '15m',
    EXPIRES_IN_5M: '5m',
  },
  
  // Time Values
  TIME_VALUES: {
    SEVEN_DAYS_MS: 7 * 24 * 60 * 60 * 1000,
    TWENTY_FOUR_HOURS_MS: 24 * 60 * 60 * 1000,
    FIFTEEN_MINUTES_MS: 15 * 60 * 1000,
  },
  
  // MFA Configuration
  MFA_CONFIG: {
    CPA_DASHBOARD_NAME: 'CPA Dashboard',
    CPA_DASHBOARD_WITH_EMAIL: 'CPA Dashboard (',
  },
  
  // String Operations
  STRING_OPS_EXTENDED: {
    SUBSTRING_START: 0,
    SUBSTRING_END: 10,
    ELLIPSIS: '...',
    SPACE: ' ',
    DASH: '-',
    EMPTY_JSON: '{}',
  },
  
  // Environment Variables
  ENV_VARS: {
    JWT_SECRET: 'JWT_SECRET',
    JWT_RESET_SECRET: 'JWT_RESET_SECRET',
    JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  },
  
  // Service Messages
  SERVICE_MESSAGES: {
    INTERNAL_ERROR_OCCURRED: 'An internal error occurred',
    PASSWORD_VALIDATION_ERROR: 'Password validation error:',
    INVALID_ROLE_PROVIDED: 'Invalid role provided',
    USER_FOUND_FOR_LOGIN: 'User found for login:',
    MFA_REQUIRED: 'MFA required',
    MFA_SETUP_INITIATED: 'MFA setup initiated',
    MFA_VERIFICATION_SUCCESS: 'MFA verification successful',
    MFA_BACKUP_CODE_VERIFICATION_SUCCESS: 'MFA backup code verification successful',
    MFA_VERIFICATION_FAILED: 'MFA verification failed',
    USER_NOT_FOUND_OR_MFA_NOT_SETUP: 'User not found or MFA not setup',
    FORGOT_PASSWORD_ERROR: 'Forgot password error:',
    RESET_PASSWORD_ERROR: 'Reset password error:',
    INVITE_TOKEN_CREATED: 'Invite token created',
    EMAIL_VERIFICATION_TOKEN_CREATED: 'Email verification token created',
    INVALID_OR_EXPIRED_INVITE_TOKEN: 'Invalid or expired invite token',
    ERROR_VALIDATING_INVITE_TOKEN: 'Error validating invite token',
    INVALID_OR_EXPIRED_EMAIL_VERIFICATION_TOKEN: 'Invalid or expired email verification token',
    ERROR_VALIDATING_EMAIL_VERIFICATION_TOKEN: 'Error validating email verification token',
    INVALID_OR_EXPIRED_RESET_TOKEN: 'Invalid or expired reset token',
    ERROR_VALIDATING_RESET_TOKEN: 'Error validating reset token',
    ERROR_SETTING_UP_MFA: 'Error setting up MFA',
    ERROR_VERIFYING_MFA: 'Error verifying MFA',
    TOKEN_MISMATCH_OR_INVALID_TYPE: 'Token mismatch or invalid type',
    TOKEN_NOT_FOUND_IN_DATABASE_OR_ALREADY_USED: 'Token not found in database or already used',
    OPTIONAL_AUTH_TOKEN_VALIDATION_FAILED: 'Optional auth token validation failed:',
    RECORD_NOT_FOUND: 'Record not found',
    UNSUPPORTED_BULK_OPERATION: 'Unsupported bulk operation',
  },

  // User Messages
  USER_MESSAGES: {
    REGISTRATION_SUCCESS_MESSAGE: 'Registration successful. Please check your email to verify your account.',
    ACCOUNT_CREATED_SUCCESS_MESSAGE: 'Account created successfully. Please check your email to verify your account.',
    USER_NOT_FOUND: 'User not found.',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token.',
    TOKEN_MISMATCH_OR_INVALID: 'Token mismatch or invalid.',
    TOKEN_NOT_FOUND_OR_ALREADY_USED: 'Token not found or already used.',
    PASSWORD_RESET_SUCCESS: 'Password reset successful.',
    PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent successfully. Please check your email.',
    PASSWORD_RESET_EMAIL_SENT_SECURITY: 'If an account with that email exists, a password reset link has been sent.',
    USER_PROFILE_RETRIEVED_SUCCESS: 'User profile retrieved successfully',
    YOU_CAN_ONLY_UPDATE_YOUR_OWN_PROFILE: 'You can only update your own profile',
    PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  },

  // Token Types Extended
  TOKEN_TYPES_EXTENDED: {
    INVITE: 'invite',
    EMAIL_VERIFICATION: 'email_verification',
    RESET: 'reset',
    PASSWORD_RESET: 'password_reset',
  },

  // Email Configuration
  EMAIL: {
    USER: 'User',
  },

  // Rate Limit Messages
  RATE_LIMIT_MESSAGES: {
    AUTH_ATTEMPTS_EXCEEDED: 'Too many authentication attempts. Please try again later.',
    SIGNUP_ATTEMPTS_EXCEEDED: 'Too many signup attempts. Please try again later.',
  },

  // Rate Limit Log Messages
  RATE_LIMIT_LOG_MESSAGES: {
    AUTH_LIMIT_EXCEEDED: 'Auth rate limit exceeded',
    SIGNUP_LIMIT_EXCEEDED: 'Signup rate limit exceeded',
  },

  // Roles
  ROLE_ADMIN: 'admin',

  // Default Values
  DEFAULT_FIELD_NAME: 'record',
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

export default HARDCODED_STRINGS;
// VALIDATION CONSTANTS - All validation messages and field names

export const VALIDATION_MESSAGES = {
  // Field Requirements
  FIELD_REQUIRED: 'Field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  INVALID_UUID: 'Invalid UUID format',
  VALIDATION_FAILED: 'Validation failed',
  
  // Password Validation
  PASSWORD_LENGTH: 'Password must be between 8 and 128 characters',
  PASSWORD_COMPLEXITY: 'Password must contain at least one letter, one number, and one special character',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  PASSWORD_TOO_WEAK: 'Password is too weak',
  PASSWORD_TOO_SHORT: 'Password is too short',
  PASSWORD_TOO_LONG: 'Password is too long',
  
  // Token Validation
  TOKEN_REQUIRED: 'Token is required',
  TOKEN_INVALID: 'Invalid token format',
  TOKEN_EXPIRED: 'Token has expired',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  
  // User Validation
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 100 characters',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  
  // MFA Validation
  MFA_CODE_REQUIRED: 'MFA code is required',
  MFA_CODE_INVALID: 'Invalid MFA code',
  MFA_CODE_LENGTH: 'MFA code must be 6 digits',
  
  // Organization Validation
  ORGANIZATION_ID_REQUIRED: 'Organization ID is required',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  ROLE_ID_REQUIRED: 'Role ID is required',
  ROLE_NOT_FOUND: 'Role not found',
  
  // General Validation
  INVALID_FORMAT: 'Invalid format',
  INVALID_INPUT: 'Invalid input',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  DUPLICATE_ENTRY: 'Duplicate entry',
  VALUE_TOO_LONG: 'Value is too long',
  VALUE_TOO_SHORT: 'Value is too short',
  INVALID_CHARACTERS: 'Contains invalid characters',
  FUTURE_DATE_NOT_ALLOWED: 'Future date not allowed',
  PAST_DATE_NOT_ALLOWED: 'Past date not allowed',
};

export const FIELD_NAMES = {
  // Authentication Fields
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  NAME: 'name',
  PHONE_NUMBER: 'phone_number',
  
  // Token Fields
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_TOKEN: 'access_token',
  TOKEN_TYPE: 'tokenType',
  TOKEN_ID: 'tokenId',
  
  // User Fields
  USER_ID: 'user_id',
  CURRENT_PASSWORD: 'currentPassword',
  NEW_PASSWORD: 'newPassword',
  
  // Organization Fields
  ORGANIZATION_ID: 'organization_id',
  TENANT_ID: 'tenant_id',
  ROLE_ID: 'role_id',
  
  // Invitation Fields
  INVITE_TOKEN: 'inviteToken',
  INVITED_BY: 'invitedBy',
  INVITER_NAME: 'inviterName',
  
  // MFA Fields
  MFA_CODE: 'mfaCode',
  TEMP_TOKEN: 'tempToken',
  
  // Email Verification
  EMAIL_VERIFICATION_TOKEN: 'emailVerificationToken',
  
  // Password Reset
  RESET_TOKEN: 'resetToken',
  URL: 'url',
  
  // Profile Fields
  UPDATES: 'updates',
  REQUESTER_ID: 'requesterId',
  
  // Query Fields
  QUERY: 'query',
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
};

export const VALIDATION_RULES = {
  // Password Rules
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
  
  // Name Rules
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  
  // Phone Rules
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  
  // Email Rules
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // MFA Rules
  MFA_CODE_LENGTH: 6,
  MFA_CODE_REGEX: /^\d{6}$/,
  
  // Token Rules
  TOKEN_MIN_LENGTH: 10,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export const VALIDATION_ERROR_CODES = {
  REQUIRED: 'REQUIRED',
  INVALID_FORMAT: 'INVALID_FORMAT',
  TOO_SHORT: 'TOO_SHORT',
  TOO_LONG: 'TOO_LONG',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE: 'INVALID_PHONE',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
  PASSWORD_WEAK: 'PASSWORD_WEAK',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  INVALID_INPUT: 'INVALID_INPUT',
};

// Default export
export default {
  VALIDATION_MESSAGES,
  FIELD_NAMES,
  VALIDATION_RULES,
  VALIDATION_ERROR_CODES,
};

import { body } from 'express-validator';
import { 
  FIELD_NAMES, 
  VALIDATION_RULES,
  VALIDATION_MESSAGES
} from '../utils/constants/validation.constants.js';

// Common validation rules
const commonValidations = {
  email: body(FIELD_NAMES.EMAIL)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),

  password: body(FIELD_NAMES.PASSWORD)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
    .isLength({ min: VALIDATION_RULES.PASSWORD_MIN_LENGTH, max: VALIDATION_RULES.PASSWORD_MAX_LENGTH })
    .withMessage(VALIDATION_MESSAGES.PASSWORD_LENGTH)
    .matches(VALIDATION_RULES.PASSWORD_REGEX)
    .withMessage(VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
    
  confirmPassword: body(FIELD_NAMES.CONFIRM_PASSWORD)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH);
      }
      return true;
    }),
    
  name: body(FIELD_NAMES.NAME)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
    .isLength({ min: VALIDATION_RULES.NAME_MIN_LENGTH, max: VALIDATION_RULES.NAME_MAX_LENGTH })
    .withMessage(VALIDATION_MESSAGES.NAME_TOO_SHORT)
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces'),
    
  phone: body(FIELD_NAMES.PHONE_NUMBER)
    .optional()
    .isMobilePhone()
    .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
    
  organizationId: body(FIELD_NAMES.ORGANIZATION_ID)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ORGANIZATION_ID_REQUIRED)
    .isUUID()
    .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    
  roleId: body(FIELD_NAMES.ROLE_ID)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.ROLE_ID_REQUIRED)
    .isUUID()
    .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
};

// Authentication validation rules
export const authValidations = {
  // Signup validation
  signup: [
    commonValidations.email,
    commonValidations.password,
    commonValidations.confirmPassword,
    commonValidations.name,
    commonValidations.roleId
  ],

  // Login validation
  login: [
    commonValidations.email,
    body(FIELD_NAMES.PASSWORD)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED),
    body(FIELD_NAMES.MFA_CODE)
      .optional()
      .isLength({ min: VALIDATION_RULES.MFA_CODE_LENGTH, max: VALIDATION_RULES.MFA_CODE_LENGTH })
      .withMessage(VALIDATION_MESSAGES.MFA_CODE_LENGTH),
  ],

  // Forgot password validation
  forgotPassword: [
    commonValidations.email,
  ],

  // Reset password validation
  resetPassword: [
    body(FIELD_NAMES.TOKEN)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED),
    body(FIELD_NAMES.NEW_PASSWORD)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isLength({ min: VALIDATION_RULES.PASSWORD_MIN_LENGTH, max: VALIDATION_RULES.PASSWORD_MAX_LENGTH })
      .withMessage(VALIDATION_MESSAGES.PASSWORD_LENGTH)
      .matches(VALIDATION_RULES.PASSWORD_REGEX)
      .withMessage(VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
    body(FIELD_NAMES.CONFIRM_PASSWORD)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error(VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH);
        }
        return true;
      }),
  ],

  // Change password validation
  changePassword: [
    body(FIELD_NAMES.CURRENT_PASSWORD)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED),
    commonValidations.password,
    commonValidations.confirmPassword
  ],

  // Update profile validation
  updateProfile: [
    commonValidations.name,
    commonValidations.email
  ],

  // Invite user validation
  inviteUser: [
    commonValidations.email,
    commonValidations.organizationId,
    commonValidations.roleId,
  ],

  // Register with invite validation
  register: [
    body(FIELD_NAMES.INVITE_TOKEN)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED),
    commonValidations.name,
    commonValidations.password,
    commonValidations.confirmPassword,
    commonValidations.phone,
  ],

  // Email verification validation
  verifyEmail: [
    body(FIELD_NAMES.EMAIL_VERIFICATION_TOKEN)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED),
  ],

  // Verify MFA code validation
  verifyMFA: [
    body(FIELD_NAMES.MFA_CODE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.MFA_CODE_REQUIRED)
      .isLength({ min: VALIDATION_RULES.MFA_CODE_LENGTH, max: VALIDATION_RULES.MFA_CODE_LENGTH })
      .withMessage(VALIDATION_MESSAGES.MFA_CODE_LENGTH)
      .matches(VALIDATION_RULES.MFA_CODE_REGEX)
      .withMessage(VALIDATION_MESSAGES.MFA_CODE_INVALID),
  ],

  // Resend MFA code validation
  resendMFA: [
    commonValidations.email,
  ],

  // Refresh token validation
  refreshToken: [
    body(FIELD_NAMES.REFRESH_TOKEN)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.REFRESH_TOKEN_REQUIRED),
  ],

  // Revoke token validation
  revokeToken: [
    body(FIELD_NAMES.TOKEN_TYPE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isIn(['access', 'refresh', 'all'])
      .withMessage('Token type must be access, refresh, or all'),
    body(FIELD_NAMES.TOKEN_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(FIELD_NAMES.TOKEN)
      .optional()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.TOKEN_REQUIRED),
  ],

  // Validate token validation
  validateToken: [
    body(FIELD_NAMES.TOKEN)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.TOKEN_REQUIRED),
    body(FIELD_NAMES.TOKEN_TYPE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isIn(['access', 'refresh'])
      .withMessage('Token type must be access or refresh'),
  ],

  // Create user validation
  createUser: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    commonValidations.confirmPassword,
    commonValidations.phone,
    commonValidations.organizationId,
    commonValidations.roleId,
  ],

  // Update user validation
  updateUser: [
    body(FIELD_NAMES.USER_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    commonValidations.name.optional(),
    commonValidations.email.optional(),
    commonValidations.phone.optional(),
    commonValidations.organizationId.optional(),
    commonValidations.roleId.optional(),
  ],

  // Delete user validation
  deleteUser: [
    body(FIELD_NAMES.USER_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get user validation
  getUser: [
    body(FIELD_NAMES.USER_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get users by organization validation
  getUsersByOrganization: [
    body(FIELD_NAMES.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get users by role validation
  getUsersByRole: [
    body(FIELD_NAMES.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Search users validation
  searchUsers: [
    body(FIELD_NAMES.QUERY)
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage(VALIDATION_MESSAGES.VALUE_TOO_SHORT),
    body(FIELD_NAMES.ORGANIZATION_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(FIELD_NAMES.ROLE_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // List users validation
  listUsers: [
    body(FIELD_NAMES.ORGANIZATION_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(FIELD_NAMES.ROLE_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(FIELD_NAMES.PAGE)
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    body(FIELD_NAMES.LIMIT)
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};

// Token validation groups
export const tokenValidations = {
  refreshToken: authValidations.refreshToken,
  revokeToken: authValidations.revokeToken,
  validateToken: authValidations.validateToken,
};

export default authValidations;
import { body } from "express-validator";
import Joi from "joi";
import {
  VALIDATION_MESSAGES,
  REQUEST_BODY_FIELDS,
  REGEX_PATTERNS,
} from "../utils/constants.util.js";

// Password regex: at least one letter, one number, one special character
const PASSWORD_REGEX = REGEX_PATTERNS.PASSWORD;

// Base validation rules that are common between create and update
const baseValidationRules = {
  full_name: body(REQUEST_BODY_FIELDS.FULL_NAME)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.NAME_REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage(VALIDATION_MESSAGES.NAME_LENGTH),
  email: body(REQUEST_BODY_FIELDS.EMAIL)
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
  phone_number: body(REQUEST_BODY_FIELDS.PHONE)
    .optional()
    .isMobilePhone()
    .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
};

// User validation rules
export const userValidations = {
  // Create user validation
  createUser: [
    ...Object.values(baseValidationRules),
    body(REQUEST_BODY_FIELDS.PASSWORD)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isLength({ min: 8, max: 128 })
      .withMessage(VALIDATION_MESSAGES.PASSWORD_LENGTH)
      .matches(PASSWORD_REGEX)
      .withMessage(VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
  ],

  // Update user schema (for Joi validation)
  updateUserSchema: {
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(REGEX_PATTERNS.NAME_PATTERN)
      .messages({
        "string.min": VALIDATION_MESSAGES.NAME_MIN,
        "string.max": VALIDATION_MESSAGES.NAME_MAX,
        "string.pattern.base": VALIDATION_MESSAGES.NAME_PATTERN,
      }),
    email: Joi.string().email().messages({
      "string.email": VALIDATION_MESSAGES.EMAIL_JOI,
    }),
    phone_number: Joi.string().pattern(REGEX_PATTERNS.PHONE_PATTERN).messages({
      "string.pattern.base": VALIDATION_MESSAGES.PHONE_PATTERN,
    }),
  },

  // Get user by ID validation
  getUserById: [
    body(REQUEST_BODY_FIELDS.USER_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Delete user validation
  deleteUser: [
    body(REQUEST_BODY_FIELDS.USER_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get users by organization validation
  getUsersByOrganization: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get users by role validation
  getUsersByRole: [
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Search users validation
  searchUsers: [
    body(REQUEST_BODY_FIELDS.QUERY)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isLength({ min: 2, max: 100 })
      .withMessage(VALIDATION_MESSAGES.SEARCH_QUERY_LENGTH),
  ],

  // Get user count validation
  getUserCount: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .optional()
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Check if user exists validation
  checkUserExists: [
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
  ],

  // Check if user exists by phone validation
  checkUserExistsByPhone: [
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
  ],

  // Get user by email validation
  getUserByEmail: [
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
  ],

  // Get user by phone validation
  getUserByPhone: [
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
  ],

  // Get user by organization and role validation
  getUserByOrganizationAndRole: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
  ],

  // Get user by organization and email validation
  getUserByOrganizationAndEmail: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
  ],

  // Get user by organization and phone validation
  getUserByOrganizationAndPhone: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
  ],

  // Get user by organization and role and email validation
  getUserByOrganizationAndRoleAndEmail: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
  ],

  // Get user by organization and role and phone validation
  getUserByOrganizationAndRoleAndPhone: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
  ],

  // Get user by organization and role and email and phone validation
  getUserByOrganizationAndRoleAndEmailAndPhone: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
  ],

  // Get user by organization and role and email and phone and name validation
  getUserByOrganizationAndRoleAndEmailAndPhoneAndName: [
    body(REQUEST_BODY_FIELDS.ORGANIZATION_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.ROLE_ID)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isUUID()
      .withMessage(VALIDATION_MESSAGES.INVALID_UUID),
    body(REQUEST_BODY_FIELDS.EMAIL)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isEmail()
      .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL),
    body(REQUEST_BODY_FIELDS.PHONE)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isMobilePhone()
      .withMessage(VALIDATION_MESSAGES.INVALID_PHONE),
    body(REQUEST_BODY_FIELDS.NAME)
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.FIELD_REQUIRED)
      .isLength({ min: 2, max: 50 })
      .withMessage(VALIDATION_MESSAGES.NAME_LENGTH)
      .matches(REGEX_PATTERNS.NAME_PATTERN)
      .withMessage(VALIDATION_MESSAGES.NAME_PATTERN),
  ],
};

export default userValidations;

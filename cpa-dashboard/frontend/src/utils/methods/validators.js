// Validation utility functions
import { AUTH_CONSTANTS } from "../constants/auth";
import { MESSAGES } from "../constants/messages";

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  if (!AUTH_CONSTANTS.PATTERNS.EMAIL.test(email)) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_EMAIL,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid, message, and strength score
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
      strength: 0,
    };
  }

  const errors = [];
  let strength = 0;

  // Check length
  if (password.length < 8) {
    errors.push("At least 8 characters");
  } else {
    strength += 1;
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("One lowercase letter");
  } else {
    strength += 1;
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter");
  } else {
    strength += 1;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push("One number");
  } else {
    strength += 1;
  }

  // Check for special character
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("One special character (@$!%*?&)");
  } else {
    strength += 1;
  }

  return {
    isValid: errors.length === 0,
    message:
      errors.length > 0 ? `Password must contain: ${errors.join(", ")}` : "",
    strength: strength,
    errors: errors,
  };
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.PASSWORD_MISMATCH,
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  if (!AUTH_CONSTANTS.PATTERNS.PHONE.test(phone)) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_PHONE,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = "This field") => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return {
      isValid: false,
      message: `${fieldName} is required`,
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Validation result
 */
export const validateLength = (value, minLength = 0, maxLength = Infinity) => {
  if (!value) {
    return { isValid: true, message: "" }; // Let required validation handle empty values
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.MIN_LENGTH.replace("{min}", minLength),
    };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.MAX_LENGTH.replace("{max}", maxLength),
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateUrl = (url) => {
  if (!url || url.trim() === "") {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_URL,
    };
  }
};

/**
 * Validate date
 * @param {string} date - Date string to validate
 * @returns {Object} Validation result
 */
export const validateDate = (date) => {
  if (!date) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_DATE,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate number
 * @param {any} value - Value to validate as number
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Object} Validation result
 */
export const validateNumber = (value, min = -Infinity, max = Infinity) => {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  const num = Number(value);
  if (isNaN(num)) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_NUMBER,
    };
  }

  if (num < min) {
    return {
      isValid: false,
      message: `Value must be at least ${min}`,
    };
  }

  if (num > max) {
    return {
      isValid: false,
      message: `Value must be no more than ${max}`,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {Object} Validation result
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.INVALID_FILE_TYPE,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.REQUIRED,
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      message: MESSAGES.VALIDATION.FILE_TOO_LARGE,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate form data against multiple rules
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules for each field
 * @returns {Object} Validation result with errors object
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];

    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid,
    errors,
  };
};

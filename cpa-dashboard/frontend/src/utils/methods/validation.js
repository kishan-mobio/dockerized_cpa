// Frontend validation utilities - moved to utils/methods/validators.js
// This file is kept for backward compatibility
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateForm as validateFormUtil,
} from "@/utils/methods/validators";

export const validationRules = {
  email: {
    required: "Email is required",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message:
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  },
  name: {
    required: "Name is required",
    minLength: 2,
    message: "Name must be at least 2 characters long",
  },
  phone: {
    required: "Phone number is required",
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
    message: "Please enter a valid phone number",
  },
};

export const validateField = (value, rule) => {
  if (rule.required && (!value || value.trim() === "")) {
    return rule.required;
  }

  if (rule.minLength && value.length < rule.minLength) {
    return rule.message;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  return null;
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const error = validateField(formData[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Export utility functions for direct use
export { validateEmail, validatePassword, validatePhone, validateRequired };

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

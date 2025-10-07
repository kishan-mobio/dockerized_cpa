import bcrypt from "bcryptjs";
import {
  SECURITY_LOG_PASSWORD,
  SECURITY_PASSWORD_MESSAGES,
  SECURITY_PASSWORD_CONFIG,
  LOGGER_COMPONENT_NAMES,
  REGEX_PATTERNS,
} from "./constants.util.js";
import { createLogger } from "./logger.util.js";

const logger = createLogger(LOGGER_COMPONENT_NAMES.PASSWORD_UTILS);

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      SECURITY_PASSWORD_CONFIG.SALT_ROUNDS
    );
    logger.info(SECURITY_LOG_PASSWORD.HASH_SUCCESS);
    return hashedPassword;
  } catch (error) {
    logger.error(SECURITY_LOG_PASSWORD.HASH_ERROR, error);
    throw new Error(SECURITY_LOG_PASSWORD.HASH_ERROR);
  }
};

export const validatePasswordStrength = (password, policy) => {
  if (
    password.length < policy.minLength ||
    password.length > policy.maxLength
  ) {
    return {
      isValid: false,
      message: SECURITY_PASSWORD_MESSAGES.PASSWORD_LENGTH(
        policy.minLength,
        policy.maxLength
      ),
    };
  }
  if (policy.requireUppercase && !REGEX_PATTERNS.UPPERCASE.test(password)) {
    return {
      isValid: false,
      message: SECURITY_PASSWORD_MESSAGES.PASSWORD_UPPERCASE,
    };
  }
  if (policy.requireLowercase && !REGEX_PATTERNS.LOWERCASE.test(password)) {
    return {
      isValid: false,
      message: SECURITY_PASSWORD_MESSAGES.PASSWORD_LOWERCASE,
    };
  }
  if (policy.requireNumbers && !REGEX_PATTERNS.NUMBERS.test(password)) {
    return {
      isValid: false,
      message: SECURITY_PASSWORD_MESSAGES.PASSWORD_NUMBER,
    };
  }
  if (
    policy.requireSpecialChars &&
    !REGEX_PATTERNS.SPECIAL_CHARS.test(password)
  ) {
    return {
      isValid: false,
      message: SECURITY_PASSWORD_MESSAGES.PASSWORD_SPECIAL,
    };
  }
  return { isValid: true };
};

export default {
  hashPassword,
  validatePasswordStrength,
};

import jwt from 'jsonwebtoken';
import { createLogger } from './logger.utils.js';
import { LOGGER_NAMES } from './constants/log.constants.js';

const logger = createLogger(LOGGER_NAMES.JWT_UTILS);

/**
 * Generate access token
 * @param {Object} payload - Token payload
 * @returns {string} Access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  });
};

/**
 * Generate reset token
 * @param {Object} payload - Token payload
 * @returns {string} Reset token
 */
export const generateResetToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_RESET_SECRET ? process.env.JWT_RESET_SECRET : process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_RESET_EXPIRY ? process.env.JWT_RESET_EXPIRY : '1h',
  });
};

/**
 * Verify token
 * @param {string} token - Token to verify
 * @param {string} secret - Secret to use for verification
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    throw error;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken
};

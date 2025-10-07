// AUTHENTICATION MIDDLEWARE - JWT Token Verification and Role/Permission Checks

import jwt from 'jsonwebtoken';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import { AUTH_MESSAGES } from '../utils/constants/auth.constants.js';
import { authRepository } from '../repository/auth.repository.js';

import { tokenRepository } from '../repository/token.repository.js';

const logger = createLogger(LOGGER_NAMES.AUTH_MIDDLEWARE);

/**
 * Verify JWT token middleware
 */
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SPACE)[1] || req.cookies?.[HARDCODED_STRINGS.ACCESS_TOKEN];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: AUTH_MESSAGES.TOKEN_REQUIRED,
    });
  }

  const decoded = jwt.verify(token, process.env[HARDCODED_STRINGS.ENV_VARS.JWT_ACCESS_SECRET]);

  const user = await authRepository.findUserById(decoded.userId);

  if (!user || user.is_deleted) {
    return res.status(401).json({
      status: false,
      message: AUTH_MESSAGES.USER_NOT_FOUND,
    });
  }

  // Check if token is revoked
  const tokenRecord = await tokenRepository.find({ token, revoked: true });
  if (tokenRecord) {
    return res.status(401).json({
      status: false,
      message: AUTH_MESSAGES.TOKEN_REVOKED,
    });
  }

  req.user = user;
  next();
};

/**
 * Check if user has required role
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        status: false,
        message: AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS,
      });
    }

    next();
  };
};

/**
 * Check if user has required permission
 */
export const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    // Check if user has the required permission
    const hasPermission = await authRepository.hasPermission(req.user.id, requiredPermission);

    
    if (!hasPermission) {
      return res.status(403).json({
        status: false,
        message: AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS,
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SPACE)[1] || req.cookies?.[HARDCODED_STRINGS.ACCESS_TOKEN];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env[HARDCODED_STRINGS.ENV_VARS.JWT_ACCESS_SECRET]);

      const user = await authRepository.findUserById(decoded.userId);
      
      if (user && !user.is_deleted) {
        req.user = user;
      }
    } catch (error) {
      // Silently ignore token errors for optional auth
      logger.debug(HARDCODED_STRINGS.SERVICE_MESSAGES.OPTIONAL_AUTH_TOKEN_VALIDATION_FAILED, error.message);
    }
  }

  next();
};

/**
 * Check if user is authenticated (synchronous check)
 */
export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: AUTH_MESSAGES.UNAUTHORIZED,
    });
  }
  next();
};

/**
 * Check if user is admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: AUTH_MESSAGES.UNAUTHORIZED,
    });
  }

  if (req.user.role !== HARDCODED_STRINGS.ROLE_ADMIN) {
    return res.status(403).json({
      status: false,
      message: AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS,
    });
  }

  next();
};

/**
 * Check if user has one of the required roles
 * @param {Array} requiredRoles - Array of required roles
 * @returns {Function} Middleware function
 */
export const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: AUTH_MESSAGES.TOKEN_REQUIRED,
      });
    }

    const userRole = req.user.role;
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        status: false,
        message: AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS,
      });
    }

    next();
  };
};

/**
 * Alias for verifyToken for backward compatibility
 */
export const verifyAccessToken = verifyToken;

export default {
  verifyToken,
  verifyAccessToken,
  requireRole,
  requirePermission,
  optionalAuth,
  isAuthenticated,
  requireAdmin,
  checkRole,
};

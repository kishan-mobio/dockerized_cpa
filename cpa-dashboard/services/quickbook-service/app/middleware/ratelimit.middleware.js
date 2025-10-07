import rateLimit from 'express-rate-limit';
import { createLogger } from '../utils/logger.utils.js';
import { RATE_LIMIT_CONFIG } from '../constants/app.constants.js';
import { RATE_LIMIT_LOG, RATE_LIMIT_MESSAGES } from '../constants/messages.constants.js';

const logger = createLogger('RATE_LIMIT_MIDDLEWARE');

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MINUTES * 60 * 1000,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.GENERAL_ERROR,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.GENERAL_ERROR,
    });
  },
});

// Strict rate limiter for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.TOO_MANY_ATTEMPTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.STRICT_LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.TOO_MANY_ATTEMPTS,
    });
  },
});

// Auth rate limiter
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.AUTH_WINDOW_MINUTES * 60 * 1000,
  max: RATE_LIMIT_CONFIG.AUTH_MAX_REQUESTS,
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.AUTH_ERROR,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  keyGenerator: (req) => {
    // Use IP + user agent for auth endpoints
    return `${req.ip}-${req.get('user-agent')}`;
  },
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.AUTH_LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.AUTH_ERROR,
    });
  },
});

// API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.API_LIMIT_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  keyGenerator: (req) => {
    // Use API key if available, otherwise use IP
    return req.headers['x-api-key'] ? req.headers['x-api-key'] : req.ip;
  },
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.API_LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.API_LIMIT_EXCEEDED,
    });
  },
});

// Signup rate limiter
export const signupLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.SIGNUP_WINDOW_MINUTES * 60 * 1000,
  max: RATE_LIMIT_CONFIG.SIGNUP_MAX_REQUESTS,
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.SIGNUP_ERROR,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  keyGenerator: (req) => {
    // Use IP for signup endpoints
    return req.ip;
  },
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.SIGNUP_LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.SIGNUP_ERROR,
    });
  },
});

// File upload rate limiter
export const fileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 file uploads per hour
  message: {
    status: false,
    message: RATE_LIMIT_MESSAGES.FILE_UPLOAD_ERROR_DETAILED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use memory store by default (no Redis warnings)
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id ? req.user.id : req.ip;
  },
  handler: (req, res) => {
    logger.warn(RATE_LIMIT_LOG.FILE_UPLOAD_LIMIT_EXCEEDED(req.ip));
    res.status(429).json({
      status: false,
      message: RATE_LIMIT_MESSAGES.FILE_UPLOAD_ERROR_DETAILED,
    });
  },
});

// Skip rate limiting for health checks
export const skipHealthCheck = (req) => {
  return req.path === '/health' ? true : req.path === '/healthz';
};

export default {
  generalLimiter,
  strictLimiter,
  authLimiter,
  apiLimiter,
  signupLimiter,
  fileUploadLimiter,
  skipHealthCheck,
};

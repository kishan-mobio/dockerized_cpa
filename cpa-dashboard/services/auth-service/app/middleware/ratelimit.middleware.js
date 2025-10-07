import rateLimit from 'express-rate-limit';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';


const logger = createLogger(LOGGER_NAMES.RATELIMIT_MIDDLEWARE);

// Auth rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    message: HARDCODED_STRINGS.RATE_LIMIT_MESSAGES.AUTH_ATTEMPTS_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + user agent for auth endpoints
    return `${req.ip}-${req.get('user-agent')}`;
  },
  handler: (req, res) => {
    logger.warn(HARDCODED_STRINGS.RATE_LIMIT_LOG_MESSAGES.AUTH_LIMIT_EXCEEDED, { ip: req.ip });
    res.status(429).json({
      success: false,
      message: HARDCODED_STRINGS.RATE_LIMIT_MESSAGES.AUTH_ATTEMPTS_EXCEEDED,
    });
  },
});

// Signup rate limiter
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 signup attempts per hour
  message: {
    success: false,
    message: HARDCODED_STRINGS.RATE_LIMIT_MESSAGES.SIGNUP_ATTEMPTS_EXCEEDED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP for signup endpoints
    return req.ip;
  },
  handler: (req, res) => {
    logger.warn(HARDCODED_STRINGS.RATE_LIMIT_LOG_MESSAGES.SIGNUP_LIMIT_EXCEEDED, { ip: req.ip });
    res.status(429).json({
      success: false,
      message: HARDCODED_STRINGS.RATE_LIMIT_MESSAGES.SIGNUP_ATTEMPTS_EXCEEDED,
    });
  },
});

export default {
  authLimiter,
  signupLimiter,
};

import { createLogger } from '../utils/logger.utils.js';
import { TOKEN_LOG_ERRORS } from '../utils/constants/auth.constants.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import {
  refreshTokenService,
  revokeTokenService,
  getActiveTokensService,
  revokeAllTokensService,
  validateTokenService
} from '../services/token.service.js';
import { errorResponse, successResponse } from '../utils/response.util.js';
import { errorHandler } from '../utils/error.utils.js';
import { validationResult } from 'express-validator';
import { setAccessTokenCookie, clearCookie } from '../utils/cookie.utils.js';
import * as status from '../utils/status_code.utils.js';



const logger = createLogger(LOGGER_NAMES.TOKEN_CONTROLLER);


// HELPER FUNCTIONS


/**
 * Check validation errors from express-validator



 */
/**
 * Check validation errors from express-validator





 * @param {Request} req
 * @param {Response} res
 * @returns {Response|null}
 */
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(TOKEN_LOG_ERRORS.TOKEN_VALIDATION_ERROR(errors.array()));
    return res.status(status.STATUS_CODE_BAD_REQUEST).json(
      errorResponse(VALIDATION_MESSAGES.VALIDATION_FAILED, errors.array())
    );
  }
  return null;
};

/**
 * Handle service response and send HTTP response



 */
/**
 * Handle service response and send HTTP response





 * @param {Response} res
 * @param {Object} serviceResult
 * @returns {Response}
 */
const handleServiceResponse = (res, serviceResult) => {
  const { success, statusCode, message, data, error } = serviceResult;
  if (success) {
    return res.status(statusCode).json(successResponse(message, data));
  }
  logger.error(message, { error });
  return res.status(statusCode).json(errorResponse(message, error));
};


// TOKEN MANAGEMENT ENDPOINTS


/**
 * Refresh Access Token using Refresh Token
 * @route POST /auth/token/refresh
 * @access Public (with valid refresh token)
 */



/**
 * Refresh Access Token using Refresh Token
 * @route POST /auth/token/refresh
 * @access Public (with valid refresh token)
 */





export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body[HARDCODED_STRINGS.REQUEST_FIELDS.REFRESH_TOKEN] || req.cookies[HARDCODED_STRINGS.REFRESH_TOKEN];
    if (!refreshToken) {
      logger.warn(TOKEN_LOG_ERRORS.TOKEN_NOT_FOUND('refresh'));
      return res.status(status.STATUS_CODE_BAD_REQUEST).json(
        errorResponse(VALIDATION_MESSAGES.FIELD_REQUIRED, HARDCODED_STRINGS.ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED)
      );
    }
    const result = await refreshTokenService(refreshToken);
    // Set new access token cookie on success
    if (result.success && result.data?.access_token) {
      setAccessTokenCookie(res, result.data.access_token);
    }
    return handleServiceResponse(res, result);
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.ACCESS_TOKEN_CREATION_FAILED(error.message));
    return errorHandler(error, req, res);
  }
};

/**
 * Revoke Specific Token
 * @route POST /auth/token/revoke
 * @access Private (authenticated users only)
 */



/**
 * Revoke Specific Token
 * @route POST /auth/token/revoke
 * @access Private (authenticated users only)
 */





export const revokeToken = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;
    const revokeData = {
      userId: req.user.id,
      tokenType: req.body.tokenType,
      tokenId: req.body.tokenId,
      token: req.body.token
    };
    const result = await revokeTokenService(revokeData);
    // Clear cookies if access/refresh tokens are revoked
    if (result.success && (req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.ACCESS || req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.REFRESH || req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.ALL)) {
      if (req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.ACCESS || req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.ALL) {
        clearCookie(res, HARDCODED_STRINGS.ACCESS_TOKEN);
      }
      if (req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.REFRESH || req.body[HARDCODED_STRINGS.REQUEST_FIELDS.TOKEN_TYPE] === HARDCODED_STRINGS.TOKEN_TYPES.ALL) {
        clearCookie(res, HARDCODED_STRINGS.REFRESH_TOKEN);
      }
    }
    return handleServiceResponse(res, result);
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_REVOCATION_FAILED(error.message));
    return errorHandler(error, req, res);
  }
};

/**
 * Revoke All User Tokens
 * @route POST /auth/token/revoke-all
 * @access Private (authenticated users only)
 */



/**
 * Revoke All User Tokens
 * @route POST /auth/token/revoke-all
 * @access Private (authenticated users only)
 */





export const revokeAllTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await revokeAllTokensService(userId);
    // Clear all cookies on success
    if (result.success) {
      clearCookie(res, HARDCODED_STRINGS.ACCESS_TOKEN);
      clearCookie(res, HARDCODED_STRINGS.REFRESH_TOKEN);
    }
    return handleServiceResponse(res, result);
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.BULK_REVOCATION_FAILED(error.message));
    return errorHandler(error, req, res);
  }
};

/**
 * Get Active Tokens for User
 * @route GET /auth/token/active
 * @access Private (authenticated users only)
 */



/**
 * Get Active Tokens for User
 * @route GET /auth/token/active
 * @access Private (authenticated users only)
 */





export const getActiveTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getActiveTokensService(userId);
    return handleServiceResponse(res, result);
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_FETCH_FAILED(error.message));
    return errorHandler(error, req, res);
  }
};

/**
 * Validate Token (for debugging/admin purposes)
 * @route POST /auth/token/validate
 * @access Private (authenticated users only)
 */



/**
 * Validate Token (for debugging/admin purposes)
 * @route POST /auth/token/validate
 * @access Private (authenticated users only)
 */





export const validateToken = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;
    const { token, tokenType } = req.body;
    const userId = req.user.id;
    const result = await validateTokenService(token, tokenType, userId);
    return handleServiceResponse(res, result);
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_VALIDATION_ERROR(error.message));
    return errorHandler(error, req, res);
  }
};

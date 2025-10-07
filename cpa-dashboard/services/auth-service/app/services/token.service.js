import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { TOKEN_LOG_ERRORS } from '../utils/constants/auth.constants.js';
import { tokenRepository } from '../repository/token.repository.js';
import { generateAccessToken, generateRefreshToken, generateResetToken } from '../utils/jwt.utils.js';
import { Op } from 'sequelize';

const logger = createLogger(LOGGER_NAMES.TOKEN_SERVICE);

/**
 * Parse time string to milliseconds
 * @param {string} timeString - Time string (e.g., '15m', '1h', '7d')
 * @returns {number} Milliseconds
 */
const parseTimeToMs = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return TOKEN_DEFAULTS.DEFAULT_TIME_MS;
  }
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1), 10);
  if (isNaN(value)) {
    return TOKEN_DEFAULTS.DEFAULT_TIME_MS;
  }
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return TOKEN_DEFAULTS.DEFAULT_TIME_MS;
  }
};


// JWT TOKEN CREATION


/**
 * Create Access Token
 */
export const createAccessToken = async (userData, expiresIn = '15m') => {
  try {
    const token = generateAccessToken(userData, expiresIn);
    logger.info(TOKEN_LOG_ACTIONS.ACCESS_TOKEN_CREATED, { 
      userId: userData.userId 
    });
    return token;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.ACCESS_TOKEN_CREATION_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};

/**
 * Create Refresh Token
 */
export const createRefreshToken = async (userData, expiresIn = '7d') => {
  try {
    const token = generateRefreshToken(userData, expiresIn);
    const expirationMs = parseTimeToMs(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    // Store refresh token in database
    await tokenRepository.create({
      userId: userData.userId,
      refreshToken: token,
      refreshTokenExpiresAt: expiresAt,
      tokenType: 'refresh',
      createdBy: userData.userId
    });

    logger.info(TOKEN_LOG_ACTIONS.REFRESH_TOKEN_CREATED, { 
      userId: userData.userId,
      expiresAt 
    });
    
    return token;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.REFRESH_TOKEN_CREATION_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};

/**
 * Create Reset Password Token
 */
export const createResetToken = async (userId, expiresIn = '1h') => {
  try {
    const token = generateResetToken({ userId }, expiresIn);
    const expirationMs = parseTimeToMs(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    // Store reset token in database
    await tokenRepository.create({
      userId,
      resetToken: token,
      resetTokenExpiresAt: expiresAt,
      tokenType: 'reset',
      createdBy: userId
    });

    logger.info(TOKEN_LOG_ACTIONS.RESET_TOKEN_CREATED, { 
      userId,
      expiresAt 
    });
    
    return token;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.RESET_TOKEN_CREATION_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};


// INVITE TOKEN MANAGEMENT


/**
 * Create Invite Token Service
 */
export const createInviteTokenService = async (inviteData, expiresIn = '7d') => {
  try {
    const inviteToken = uuidv4() + '-' + Date.now();
    const expirationMs = parseTimeToMs(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    // Store invite token in database
    const tokenData = await tokenRepository.create({
      userId: null, // No user yet
      inviteToken,
      inviteTokenExpiresAt: expiresAt,
      tokenType: 'invite',
      createdBy: inviteData.invited_by,
      metadata: JSON.stringify(inviteData)
    });

    logger.info(TOKEN_LOG_ACTIONS.INVITE_TOKEN_CREATED, { 
      email: inviteData.email,
      tokenId: tokenData.id,
      expiresAt 
    });
    
    return inviteToken;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.INVITE_TOKEN_CREATION_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};


// EMAIL VERIFICATION TOKEN MANAGEMENT


/**
 * Create Email Verification Token Service
 */
export const createEmailVerificationTokenService = async (userId, expiresIn = '24h') => {
  try {
    const emailVerificationToken = uuidv4() + '-' + Date.now();
    const expirationMs = parseTimeToMs(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    // Store email verification token in database
    const tokenData = await tokenRepository.create({
      userId,
      emailVerificationToken,
      emailVerificationTokenExpiresAt: expiresAt,
      tokenType: 'email_verification',
      createdBy: userId
    });

    logger.info(TOKEN_LOG_ACTIONS.EMAIL_VERIFICATION_TOKEN_CREATED, { 
      userId,
      tokenId: tokenData.id,
      expiresAt 
    });
    
    return emailVerificationToken;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.EMAIL_VERIFICATION_TOKEN_CREATION_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};


// TOKEN VALIDATION


/**
 * Validate Token (Generic)
 */
export const validateToken = async (token, tokenType = 'refresh') => {
  try {
    logger.info(TOKEN_LOG_VALIDATION.TOKEN_VALIDATION_START, { tokenType });

    let tokenData;
    
    switch (tokenType) {
      case 'refresh':
        tokenData = await tokenRepository.find({
          refreshToken: token,
          revoked: false,
          refreshTokenExpiresAt: { [Op.gt]: new Date() }
        });
        break;
        
      case 'reset':
        tokenData = await tokenRepository.find({
          resetToken: token,
          revoked: false,
          resetTokenExpiresAt: { [Op.gt]: new Date() }
        });
        break;
        
      case 'invite':
        tokenData = await tokenRepository.find({
          inviteToken: token,
          revoked: false,
          inviteTokenExpiresAt: { [Op.gt]: new Date() }
        });
        break;
        
      case 'email_verification':
        tokenData = await tokenRepository.find({
          emailVerificationToken: token,
          revoked: false,
          emailVerificationTokenExpiresAt: { [Op.gt]: new Date() }
        });
        break;
        
      default:
        logger.warn(TOKEN_LOG_ERRORS.INVALID_TOKEN_TYPE, { tokenType });
        return null;
    }

    if (!tokenData) {
      logger.warn(TOKEN_LOG_ERRORS.TOKEN_NOT_FOUND, { tokenType });
      return null;
    }

    logger.info(TOKEN_LOG_VALIDATION.TOKEN_VALIDATION_SUCCESS, { 
      tokenType,
      tokenId: tokenData.id,
      userId: tokenData.userId 
    });

    return {
      tokenId: tokenData.id,
      userId: tokenData.userId,
      createdAt: tokenData.createdAt,
      metadata: tokenData.metadata ? JSON.parse(tokenData.metadata) : null
    };

  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_VALIDATION_ERROR, { 
      error: error.message,
      tokenType 
    });
    return null;
  }
};

/**
 * Validate JWT Token
 */
export const validateJWTToken = async (token, tokenType = 'access') => {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    
    logger.info(TOKEN_LOG_VALIDATION.JWT_VALIDATION_SUCCESS, { 
      tokenType,
      userId: decoded.userId 
    });
    
    return decoded;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.JWT_VALIDATION_ERROR, { 
      error: error.message,
      tokenType 
    });
    return null;
  }
};


// TOKEN REVOCATION


/**
 * Revoke Single Token
 */
export const revokeToken = async (tokenId) => {
  try {
    await tokenRepository.update(tokenId, { 
      revoked: true,
      updatedAt: new Date()
    });

    logger.info(TOKEN_LOG_ACTIONS.TOKEN_REVOKED, { tokenId });
    return true;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_REVOCATION_FAILED, { 
      error: error.message,
      tokenId 
    });
    throw error;
  }
};

/**
 * Revoke All User Tokens
 */
export const revokeAllUserTokens = async (userId) => {
  try {
    await tokenRepository.bulkUpdate(
      { userId },
      { 
        revoked: true,
        updatedAt: new Date()
      }
    );

    logger.info(TOKEN_LOG_ACTIONS.ALL_TOKENS_REVOKED, { userId });
    return true;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.BULK_REVOCATION_FAILED, { 
      error: error.message,
      userId 
    });
    throw error;
  }
};

/**
 * Revoke Tokens by Type
 */
export const revokeTokensByType = async (userId, tokenType) => {
  try {
    await tokenRepository.bulkUpdate(
      { 
        userId,
        tokenType 
      },
      { 
        revoked: true,
        updatedAt: new Date()
      }
    );

    logger.info(TOKEN_LOG_ACTIONS.TOKENS_REVOKED_BY_TYPE, { 
      userId,
      tokenType 
    });
    return true;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TYPE_REVOCATION_FAILED, { 
      error: error.message,
      userId,
      tokenType 
    });
    throw error;
  }
};


// TOKEN CLEANUP


/**
 * Clean Expired Tokens
 */
export const cleanExpiredTokens = async () => {
  try {
    const now = new Date();
    
    // Delete expired tokens
    const deletedCount = await tokenRepository.bulkDelete({
      [Op.or]: [
        { refreshTokenExpiresAt: { [Op.lt]: now } },
        { resetTokenExpiresAt: { [Op.lt]: now } },
        { inviteTokenExpiresAt: { [Op.lt]: now } },
        { emailVerificationTokenExpiresAt: { [Op.lt]: now } }
      ]
    });

    logger.info(TOKEN_LOG_ACTIONS.EXPIRED_TOKENS_CLEANED, { 
      deletedCount 
    });
    
    return deletedCount;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_CLEANUP_FAILED, { 
      error: error.message 
    });
    throw error;
  }
};


// TOKEN UTILITIES


/**
 * Get User Active Tokens
 */
export const getUserActiveTokens = async (userId) => {
  try {
    const tokens = await tokenRepository.findAll({
      userId,
      revoked: false,
      [Op.or]: [
        { refreshTokenExpiresAt: { [Op.gt]: new Date() } },
        { resetTokenExpiresAt: { [Op.gt]: new Date() } },
        { inviteTokenExpiresAt: { [Op.gt]: new Date() } },
        { emailVerificationTokenExpiresAt: { [Op.gt]: new Date() } }
      ]
    });

    logger.info(TOKEN_LOG_ACTIONS.USER_TOKENS_FETCHED, { 
      userId,
      tokenCount: tokens.length 
    });
    
    return tokens;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_FETCH_FAILED, { 
      error: error.message,
      userId 
    });
    throw error;
  }
};

/**
 * Get Token Statistics
 */
export const getTokenStatistics = async (userId) => {
  try {
    const stats = await tokenRepository.count({
      userId,
      groupBy: ['tokenType', 'revoked']
    });

    logger.info(TOKEN_LOG_ACTIONS.TOKEN_STATS_FETCHED, { 
      userId 
    });
    
    return stats;
  } catch (error) {
    logger.error(TOKEN_LOG_ERRORS.TOKEN_STATS_FAILED, { 
      error: error.message,
      userId 
    });
    throw error;
  }
};


// SERVICE LAYER WRAPPERS


/**
 * Refresh Token Service
 */
export const refreshTokenService = async (refreshToken) => {
  try {
    // Validate the refresh token
    const tokenData = await validateToken(refreshToken, 'refresh');
    
    if (!tokenData) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid or expired refresh token',
        data: null,
        error: 'INVALID_REFRESH_TOKEN'
      };
    }

    // Get user data (you might need to fetch from user repository)
    const userData = { userId: tokenData.userId };
    
    // Create new access token
    const newAccessToken = await createAccessToken(userData);
    
    return {
      success: true,
      statusCode: 200,
      message: 'Access token refreshed successfully',
      data: {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: '15m'
      },
      error: null
    };
  } catch (error) {
    logger.error('Refresh token service error:', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null,
      error: error.message
    };
  }
};

/**
 * Revoke Token Service
 */
export const revokeTokenService = async (revokeData) => {
  try {
    const { userId, tokenType, tokenId, token: _token } = revokeData;
    
    if (tokenType === 'all') {
      await revokeAllUserTokens(userId);
    } else if (tokenId) {
      await revokeToken(tokenId);
    } else if (tokenType) {
      await revokeTokensByType(userId, tokenType);
    } else {
      return {
        success: false,
        statusCode: 400,
        message: 'Token type or token ID is required',
        data: null,
        error: 'MISSING_TOKEN_INFO'
      };
    }
    
    return {
      success: true,
      statusCode: 200,
      message: 'Token(s) revoked successfully',
      data: null,
      error: null
    };
  } catch (error) {
    logger.error('Revoke token service error:', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null,
      error: error.message
    };
  }
};

/**
 * Get Active Tokens Service
 */
export const getActiveTokensService = async (userId) => {
  try {
    const tokens = await getUserActiveTokens(userId);
    
    return {
      success: true,
      statusCode: 200,
      message: 'Active tokens retrieved successfully',
      data: {
        tokens,
        count: tokens.length
      },
      error: null
    };
  } catch (error) {
    logger.error('Get active tokens service error:', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null,
      error: error.message
    };
  }
};

/**
 * Revoke All Tokens Service
 */
export const revokeAllTokensService = async (userId) => {
  try {
    await revokeAllUserTokens(userId);
    
    return {
      success: true,
      statusCode: 200,
      message: 'All tokens revoked successfully',
      data: null,
      error: null
    };
  } catch (error) {
    logger.error('Revoke all tokens service error:', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null,
      error: error.message
    };
  }
};

/**
 * Validate Token Service
 */
export const validateTokenService = async (token, tokenType, userId) => {
  try {
    let isValid = false;
    let tokenData = null;
    
    if (tokenType === 'access') {
      // Validate JWT token
      tokenData = await validateJWTToken(token, tokenType);
      isValid = tokenData !== null && tokenData.userId === userId;
    } else {
      // Validate stored token
      tokenData = await validateToken(token, tokenType);
      isValid = tokenData !== null && tokenData.userId === userId;
    }
    
    return {
      success: true,
      statusCode: 200,
      message: isValid ? 'Token is valid' : 'Token is invalid',
      data: {
        valid: isValid,
        tokenData: isValid ? tokenData : null
      },
      error: null
    };
  } catch (error) {
    logger.error('Validate token service error:', { error: error.message });
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      data: null,
      error: error.message
    };
  }
};
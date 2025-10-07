import { createLogger } from '../utils/logger.utils.js';
import { 
  inviteUserService,
  registerWithInviteService,
  verifyEmailService,
  loginService,
  logoutService,
  setupMFAService,
  verifyMFAService,
  signUpService,
  forgotPasswordService,
  resetPasswordService,
  getUserProfileService,
  changePasswordService,
  updateUserProfileService
} from '../services/auth.service.js';
import { LOGGER_NAMES, LOGGER_MESSAGES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import { errorResponse, successResponse } from '../utils/response.util.js';
import { errorHandler } from '../utils/error.utils.js';
import { validationResult } from 'express-validator';
import { setAccessTokenCookie, setRefreshTokenCookie, clearCookie } from '../utils/cookie.utils.js';
import * as status from '../utils/status_code.utils.js';

const logger = createLogger(LOGGER_NAMES.AUTH_CONTROLLER);

// HELPER FUNCTIONS

/**
 * Check validation errors from express-validator
 */
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.STATUS_CODE_BAD_REQUEST).json(
      errorResponse(VALIDATION_MESSAGES.VALIDATION_FAILED, errors.array())
    );
  }
  return null;
};

/**
 * Handle service response and send HTTP response
 */
const handleServiceResponse = (res, serviceResult) => {
  const { success, statusCode, message, data, error } = serviceResult;
  
  if (success) {
    return res.status(statusCode).json(successResponse(message, data));
  } else {
    return res.status(statusCode).json(errorResponse(message, error));
  }
};


// AUTHENTICATION ENDPOINTS




/**
 * Invite User (Admin Only)
 * @route POST /auth/invite
 * @access Private (Admin only)
 */




export const inviteUser = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const inviteData = {
      email: req.body.email,
      role_id: req.body.role_id,
      organization_id: req.body.organization_id,
      tenant_id: req.body.tenant_id,
      invitedBy: req.user.id,
      inviterName: req.user.name
    };

    const result = await inviteUserService(inviteData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} ${LOGGER_MESSAGES.ERROR.CONTROLLER.INVITE_USER_ERROR}`, { 
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      email: req.body?.email
    });
    return errorHandler(error, req, res);
  }
};



/**
 * Register with Invite Token
 * @route POST /auth/register
 * @access Public (with valid invite token)
 */




export const register = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const registrationData = {
      inviteToken: req.body.inviteToken,
      name: req.body.name,
      password: req.body.password,
      phone_number: req.body.phone_number
    };

    const result = await registerWithInviteService(registrationData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} ${LOGGER_MESSAGES.ERROR.CONTROLLER.REGISTER_ERROR}`, { 
      error: error.message,
      stack: error.stack,
      inviteToken: req.body?.inviteToken?.substring(0, 10) + HARDCODED_STRINGS.STRING_OPS_EXTENDED.ELLIPSIS
    });
    return errorHandler(error, req, res);
  }
};



/**
 * Verify Email Address
 * @route POST /auth/verify-email
 * @access Public (with valid email verification token)
 */




export const verifyEmail = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const { emailVerificationToken } = req.body;
    const result = await verifyEmailService(emailVerificationToken);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} verifyEmail in auth.controller.js:`, { 
      error: error.message,
      stack: error.stack,
      token: req.body?.emailVerificationToken?.substring(0, 10) + HARDCODED_STRINGS.STRING_OPS_EXTENDED.ELLIPSIS
    });
    return errorHandler(error, req, res);
  }
};



/**
 * User Login (Enhanced with MFA)
 * @route POST /auth/login
 * @access Public
 */




export const login = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const loginData = {
      email: req.body.email,
      password: req.body.password,
      mfaCode: req.body.mfaCode,
      userAgent: req.headers[HARDCODED_STRINGS.USER_AGENT],
      ipAddress: req.ip
    };

    const result = await loginService(loginData);
    
    // Handle cookies for successful login
    if (result.success && result.data?.tokens) {
      setAccessTokenCookie(res, result.data.tokens.access_token);
      setRefreshTokenCookie(res, result.data.tokens.refresh_token);
    }

    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} login in auth.controller.js:`, { 
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
      userAgent: req.headers[HARDCODED_STRINGS.USER_AGENT]
    });
    return errorHandler(error, req, res);
  }
};

/**
 * User Logout
 * @route POST /auth/logout
 * @access Private (authenticated users only)
 */
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await logoutService(userId);

    // Clear cookies on successful logout
    if (result.success) {
      clearCookie(res, HARDCODED_STRINGS.ACCESS_TOKEN);
      clearCookie(res, HARDCODED_STRINGS.REFRESH_TOKEN);
    }

    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} logout in auth.controller.js:`, { 
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    return errorHandler(error, req, res);
  }
};

/**
 * Setup Multi-Factor Authentication
 * @route POST /auth/mfa/setup
 * @access Private (authenticated users only)
 */
export const setupMFA = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const userId = req.user.id;
    const userEmail = req.user.email;
    
    const result = await setupMFAService(userId, userEmail);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} setupMFA:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Verify Multi-Factor Authentication
 * @route POST /auth/mfa/verify
 * @access Public (during login flow) / Private (during setup)
 */
export const verifyMFA = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const verifyData = {
      email: req.body.email,
      mfaCode: req.body.mfaCode,
      tempToken: req.body.tempToken
    };

    const result = await verifyMFAService(verifyData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} verifyMFA:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Forgot Password - Request Reset Link
 * @route POST /auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const { email, url } = req.body;
    const result = await forgotPasswordService(email, url);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} forgotPassword:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Reset Password using Token
 * @route POST /auth/reset-password
 * @access Public (with valid reset token)
 */
export const resetPassword = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const resetData = {
      token: req.body.token,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    };

    const result = await resetPasswordService(resetData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} resetPassword:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};


// LEGACY / PROFILE ENDPOINTS


/**
 * Legacy Sign Up (Direct Registration)
 * @route POST /auth/signup
 * @access Public
 */
export const signUp = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const signUpData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
      role_id: req.body.role_id
    };

    const result = await signUpService(signUpData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} signUp:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Get User Profile
 * @route GET /auth/profile
 * @access Private (authenticated users only)
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getUserProfileService(userId);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} getProfile:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Change Password
 * @route POST /auth/change-password
 * @access Private (authenticated users only)
 */
export const changePassword = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const passwordData = {
      userId: req.user.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword
    };

    const result = await changePasswordService(passwordData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} changePassword:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};

/**
 * Update User Profile
 * @route PUT /auth/profile/:id
 * @access Private (authenticated users only)
 */
export const updateProfile = async (req, res) => {
  try {
    const validationError = checkValidation(req, res);
    if (validationError) return validationError;

    const updateData = {
      userId: req.params.id,
      updates: req.body,
      requesterId: req.user.id // For authorization check
    };

    const result = await updateUserProfileService(updateData);
    return handleServiceResponse(res, result);

  } catch (error) {
    logger.error(`${HARDCODED_STRINGS.ERROR_MESSAGES.CONTROLLER_ERROR} updateProfile:`, { error: error.message });
    return errorHandler(error, req, res);
  }
};
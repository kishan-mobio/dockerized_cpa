import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES, LOGGER_MESSAGES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import { AUTH_MESSAGES } from '../utils/constants/auth.constants.js';
import { authRepository } from '../repository/auth.repository.js';
import { tokenRepository } from '../repository/token.repository.js';
// Using authRepository instead of userRepository for auth operations
import { 
  createAccessToken, 
  createRefreshToken, 
  revokeAllUserTokens
} from './token.service.js';
import { 
  sendForgotPasswordEmailSendGrid, 
  sendPasswordResetConfirmation,
  sendInviteEmail,
  sendEmailVerification,
  sendMFASetupConfirmation
} from '../utils/sendgrid-email.utils.js';
import * as status from '../utils/status_code.utils.js';

const logger = createLogger(LOGGER_NAMES.AUTH_SERVICE);

// HELPER FUNCTIONS

/**
 * Create standardized service response
 */
const createServiceResponse = (success, statusCode, message, data = null, error = null) => ({
  success,
  statusCode,
  message,
  data,
  error
});

/**
 * Handle service errors consistently
 */
const handleServiceError = (error, operation) => {
  logger.error(`Service error in ${operation}:`, { error: error.message });
  return createServiceResponse(
    false,
    status.STATUS_CODE_INTERNAL_SERVER_ERROR,
    HARDCODED_STRINGS.SERVICE_MESSAGES.INTERNAL_ERROR_OCCURRED,
    null,
    error.message
  );
};

/**
 * Validate password strength
 */
const validatePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.PASSWORD_VALIDATION_ERROR, error);
    return false;
  }
};

// AUTHENTICATION SERVICES

/**
 * Invite User Service - Send invitation to new user
 */
export const inviteUserService = async (inviteData) => {
  try {
    const { email, role_id, organization_id, tenant_id, invitedBy, inviterName } = inviteData;



    logger.info(AUTH_LOG_ACTIONS.INVITE_USER_ATTEMPT, { email, invitedBy });
    logger.info(LOGGER_MESSAGES.AUTH.INVITE_USER_ATTEMPT, { email, invitedBy });

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      logger.warn(LOGGER_MESSAGES.AUTH.USER_ALREADY_EXISTS, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.USER_ALREADY_EXISTS
      );
    }


    // Note: Role validation removed - implement when role repository is available

    // Create invite token
    const inviteToken = await createInviteToken({
      email,
      role_id,
      organization_id,
      tenant_id,
      invited_by: invitedBy
    });

    // Send invite email
    await sendInviteEmail(email, inviteToken, inviterName);

    logger.info(LOGGER_MESSAGES.AUTH.INVITE_USER_SUCCESS, { email, invitedBy });
    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.INVITE_SENT,
      { email }
    );

  } catch (error) {
    return handleServiceError(error, 'inviteUserService');
  }
};

/**
 * Register with Invite Service - Complete user registration
 */
export const registerWithInviteService = async (registrationData) => {
  try {
    const { inviteToken, name, password, phone_number } = registrationData;



    logger.info(AUTH_LOG_ACTIONS.REGISTER_ATTEMPT, { inviteToken: inviteToken.substring(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_START, HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_END) + HARDCODED_STRINGS.STRING_OPS_EXTENDED.ELLIPSIS });
    logger.info('REGISTER_ATTEMPT', { inviteToken: inviteToken.substring(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_START, HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_END) + HARDCODED_STRINGS.STRING_OPS_EXTENDED.ELLIPSIS });

    // Validate invite token
    const inviteData = await validateInviteToken(inviteToken);
    if (!inviteData) {
      logger.warn('INVALID_INVITE_TOKEN');
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_INVITE_TOKEN
      );
    }

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(inviteData.email);
    if (existingUser) {
      logger.warn(USER_ALREADY_EXISTS, { email: inviteData.email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        'User already exists'
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      name,
      email: inviteData.email,
      password: hashedPassword,
      role_id: inviteData.role_id,
      organization_id: inviteData.organization_id,
      tenant_id: inviteData.tenant_id,
      phone_number,
      invited_by: inviteData.invited_by,
      invited_at: inviteData.created_at,
      is_active: true,
      email_verified: false
    };

    const user = await authRepository.createUser(userData);

    // Create email verification token and send email
    const emailVerificationToken = await createEmailVerificationToken(user.id);
    await sendEmailVerification(user.email, emailVerificationToken, user.name);

    // Mark invite token as used
    await tokenRepository.update({ inviteToken }, { revoked: true, used: true });

    logger.info(REGISTER_SUCCESS, { 
      userId: user.id, 
      email: user.email 
    });

    return createServiceResponse(
      true,
      status.STATUS_CODE_CREATED,
      AUTH_MESSAGES.REGISTRATION_SUCCESS,
      {
        message: HARDCODED_STRINGS.REGISTRATION_SUCCESS_MESSAGE,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          email_verified: user.email_verified
        }
      }
    );

  } catch (error) {
    return handleServiceError(error, 'registerWithInviteService');
  }
};

/**
 * Verify Email Service - Verify user email address
 */
export const verifyEmailService = async (emailVerificationToken) => {
  try {


    logger.info(AUTH_LOG_ACTIONS.EMAIL_VERIFICATION_ATTEMPT);
    logger.info(EMAIL_VERIFICATION_ATTEMPT);

    // Validate email verification token
    const tokenData = await validateEmailVerificationToken(emailVerificationToken);
    if (!tokenData) {
      logger.warn(INVALID_EMAIL_VERIFICATION_TOKEN);
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_EMAIL_VERIFICATION_TOKEN
      );
    }

    // Get user and verify existence
    const user = await authRepository.findUserById(tokenData.userId);
    if (!user) {
      logger.warn(USER_NOT_FOUND, { userId: tokenData.userId });
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
USER_NOT_FOUND
      );
    }

    // Mark email as verified
    await authRepository.updateEmailVerification(user.id, true);

    // Mark token as used
    await tokenRepository.update({ emailVerificationToken }, { revoked: true, used: true });

    logger.info(EMAIL_VERIFICATION_SUCCESS, { 
      userId: user.id,
      email: user.email 
    });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.EMAIL_VERIFIED_SUCCESS
    );

  } catch (error) {
    return handleServiceError(error, 'verifyEmailService');
  }
};

/**
 * Login Service - Complete authentication flow with MFA
 */
export const loginService = async (loginData) => {
  try {
    const { email, password, mfaCode } = loginData;



    logger.info(AUTH_LOG_ACTIONS.LOGIN_ATTEMPT, { email });
    logger.info(LOGIN_ATTEMPT, { email });

    // Check if user exists
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      logger.warn(INVALID_CREDENTIALS, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Debug logging to check user data
    logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.USER_FOUND_FOR_LOGIN, { 
      email: user.email, 
      hasPassword: !!user.password_hash,
      isActive: user.is_active 
    });

    // Check if user is active
    if (!user.is_active) {
      logger.warn(ACCOUNT_INACTIVE, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.ACCOUNT_INACTIVE
      );
    }

    // Validate password
    const isPasswordValid = await validatePassword(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn(INVALID_CREDENTIALS, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_CREDENTIALS
      );
    } 

    // Check MFA if enabled
    if (user.mfa_enabled) {
      if (!mfaCode) {
        logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.MFA_REQUIRED, { email });
        const tempToken = await createAccessToken({ 
          userId: user.id, 
          email: user.email, 
          type: HARDCODED_STRINGS.JWT.MFA_TEMP_TYPE 
        }, HARDCODED_STRINGS.JWT_CONFIG.EXPIRES_IN_5M);
        
        return createServiceResponse(
          false,
          status.STATUS_CODE_MULTI_STATUS,
          AUTH_MESSAGES.MFA_REQUIRED,
          {
            mfa_required: true,
            temp_token: tempToken
          }
        );
      }

      // Verify MFA code
      const mfaValid = await verifyUserMFA(user.id, mfaCode);
      if (!mfaValid) {
        logger.warn(INVALID_MFA_CODE, { email });
        return createServiceResponse(
          false,
          status.STATUS_CODE_BAD_REQUEST,
          AUTH_MESSAGES.INVALID_MFA_CODE
        );
      }
    }

    // Generate tokens
    const accessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles || [],
      tenant_id: user.tenant_id
    });

    const refreshToken = await createRefreshToken({
      userId: user.id,
      email: user.email,
      roles: user.roles || [],
      tenant_id: user.tenant_id
    });

    // Update last login
    await authRepository.updateLastLogin(user.id);

    logger.info(LOGIN_SUCCESS, { 
      userId: user.id, 
      email: user.email 
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.LOGIN_SUCCESS,
      {
        user: {
          ...userWithoutPassword,
          role: {
            id: user.role?.id,
            name: user.role?.name,
            description: user.role?.description
          }
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken
        }
      }
    );

  } catch (error) {
    return handleServiceError(error, 'loginService');
  }
};

/**
 * Logout Service - Secure logout with token revocation
 */
export const logoutService = async (userId) => {
  try {


    logger.info(AUTH_LOG_ACTIONS.LOGOUT_ATTEMPT, { userId });
    logger.info(LOGOUT_ATTEMPT, { userId });

    // Revoke all tokens for user
    await revokeAllUserTokens(userId);

    logger.info(LOGOUT_SUCCESS, { userId });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.LOGOUT_SUCCESS
    );

  } catch (error) {
    return handleServiceError(error, 'logoutService');
  }
};

/**
 * Setup MFA Service - Complete MFA setup business logic
 */
export const setupMFAService = async (userId, userEmail) => {
  try {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
USER_NOT_FOUND
      );
    }

    logger.info(MFA_SETUP_ATTEMPT, { userId });

    // Generate MFA secret
    const secret = speakeasy.generateSecret({
      name: `${HARDCODED_STRINGS.MFA_CONFIG.CPA_DASHBOARD_WITH_EMAIL}${userEmail})`,
      issuer: HARDCODED_STRINGS.MFA_CONFIG.CPA_DASHBOARD_NAME
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Save secret (temporarily, until verified)
    await setupUserMFA(userId, secret.base32);

    logger.info(MFA_SETUP_SUCCESS, { userId });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.MFA_SETUP_SUCCESS,
      {
        secret: secret.base32,
        qr_code: qrCodeUrl,
        manual_entry_key: secret.base32,
        issuer: HARDCODED_STRINGS.MFA_CONFIG.CPA_DASHBOARD_NAME,
        account_name: userEmail
      }
    );

  } catch (error) {
    return handleServiceError(error, 'setupMFAService');
  }
};

/**
 * Verify MFA Service - MFA verification business logic
 */
export const verifyMFAService = async (verifyData) => {
  try {
    const { email, mfaCode, tempToken } = verifyData;



    logger.info(AUTH_LOG_ACTIONS.MFA_VERIFY_ATTEMPT, { email });
    logger.info(MFA_VERIFY_ATTEMPT, { email });

    let user;
    
    // Handle different verification contexts
    if (tempToken) {
      // Verify temporary token from login flow
      const tokenData = await jwt.verify(tempToken, process.env[HARDCODED_STRINGS.ENV_VARS.JWT_SECRET]);
      if (!tokenData || tokenData.type !== HARDCODED_STRINGS.JWT.MFA_TEMP_TYPE) {
        return createServiceResponse(
          false,
          status.STATUS_CODE_BAD_REQUEST,
          AUTH_MESSAGES.INVALID_TEMP_TOKEN
        );
      }
      user = await authRepository.findUserById(tokenData.userId);
    } else {
      // Direct MFA verification during setup
      user = await authRepository.findUserByEmail(email);
    }

    if (!user) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
USER_NOT_FOUND
      );
    }

    // Verify MFA code
    const mfaValid = await verifyUserMFA(user.id, mfaCode);
    if (!mfaValid) {
      logger.warn(INVALID_MFA_CODE, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_MFA_CODE
      );
    }

    // Enable MFA if this is setup verification
    if (!user.mfa_enabled) {
      await authRepository.updateMFASettings(user.id, { mfa_enabled: true });
      await sendMFASetupConfirmation(user.email, user.name);
    }

    logger.info(MFA_VERIFY_SUCCESS, { userId: user.id });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.MFA_VERIFY_SUCCESS
    );

  } catch (error) {
    return handleServiceError(error, 'verifyMFAService');
  }
};

/**
 * Forgot Password Service - Send password reset email using SendGrid + JWT
 */
export const forgotPasswordService = async (email, _url) => {
  try {


    logger.info(PASSWORD_RESET_LOG_ACTIONS.FORGOT_PASSWORD_ATTEMPT, { email });
    logger.info(FORGOT_PASSWORD_ATTEMPT, { email });

    // Check if user exists
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      logger.warn(USER_NOT_FOUND, { email });
      // Return success message for security (don't reveal if email exists)
      return createServiceResponse(
        true,
        status.STATUS_CODE_SUCCESS,
        HARDCODED_STRINGS.PASSWORD_RESET_EMAIL_SENT_SECURITY
      );
    }

    // Create JWT reset token (expires in 15 minutes)
    const resetToken = jwt.sign(
      { 
        email: user.email, 
        id: user.id,
        type: HARDCODED_STRINGS.TOKEN_TYPES_EXTENDED.PASSWORD_RESET
      },
      process.env[HARDCODED_STRINGS.ENV_VARS.JWT_SECRET] || process.env[HARDCODED_STRINGS.ENV_VARS.JWT_RESET_SECRET],
      { expiresIn: HARDCODED_STRINGS.JWT_CONFIG.EXPIRES_IN_15M }
    );

    // Store reset token in database for tracking and validation
    await tokenRepository.create({
      userId: user.id,
      resetToken: resetToken,
      resetTokenExpiresAt: new Date(Date.now() + HARDCODED_STRINGS.TIME_VALUES.FIFTEEN_MINUTES_MS), // 15 minutes
      tokenType: HARDCODED_STRINGS.TOKEN_TYPES_EXTENDED.RESET,
      createdBy: user.id
    });

    // Send reset email using SendGrid
    const userFirstName = user.full_name ? user.full_name.split(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SPACE)[HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_START] : HARDCODED_STRINGS.EMAIL.USER;
    await sendForgotPasswordEmailSendGrid(user.email, resetToken, userFirstName);

    logger.info(FORGOT_PASSWORD_SUCCESS, { 
      userId: user.id,
      tokenExpiry: HARDCODED_STRINGS.JWT_CONFIG.EXPIRES_IN_15M
    });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      HARDCODED_STRINGS.PASSWORD_RESET_EMAIL_SENT
    );

  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.FORGOT_PASSWORD_ERROR, error);
    return handleServiceError(error, 'forgotPasswordService');
  }
};

/**
 * Reset Password Service - Complete password reset using JWT verification
 */
export const resetPasswordService = async (resetData) => {
  try {
    const { email, token, newPassword } = resetData;



    logger.info(PASSWORD_RESET_LOG_ACTIONS.RESET_PASSWORD_ATTEMPT, { email });
    logger.info(RESET_PASSWORD_ATTEMPT, { email });

    // Find user by email
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      logger.warn(USER_NOT_FOUND, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
        HARDCODED_STRINGS.USER_NOT_FOUND
      );
    }

    // Verify JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env[HARDCODED_STRINGS.ENV_VARS.JWT_SECRET] || process.env[HARDCODED_STRINGS.ENV_VARS.JWT_RESET_SECRET]);
    } catch (error) {
      logger.warn(INVALID_TOKEN, { email, error: error.message });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        HARDCODED_STRINGS.INVALID_OR_EXPIRED_TOKEN
      );
    }

    // Verify token belongs to this user and is the right type
    if (decodedToken.email !== email || decodedToken.id !== user.id || decodedToken.type !== HARDCODED_STRINGS.TOKEN_TYPES_EXTENDED.PASSWORD_RESET) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.TOKEN_MISMATCH_OR_INVALID_TYPE, { email, tokenEmail: decodedToken.email, tokenUserId: decodedToken.id });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        HARDCODED_STRINGS.TOKEN_MISMATCH_OR_INVALID
      );
    }

    // Check if token exists in database and hasn't been used
    const storedToken = await tokenRepository.findOne({
      userId: user.id,
      resetToken: token,
      revoked: false
    });

    if (!storedToken) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.TOKEN_NOT_FOUND_IN_DATABASE_OR_ALREADY_USED, { email, userId: user.id });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,


        HARDCODED_STRINGS.TOKEN_NOT_FOUND_OR_ALREADY_USED
      );
    }

    // Hash new password (using bcrypt with 10 rounds like your example)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await authRepository.updatePassword(user.id, hashedPassword);
    
    // Invalidate the reset token
    await tokenRepository.update(
      { id: storedToken.id }, 
      { revoked: true, used: true, updatedAt: new Date() }
    );

    // Send confirmation email
    const userFirstName = user.full_name ? user.full_name.split(HARDCODED_STRINGS.STRING_OPS_EXTENDED.SPACE)[HARDCODED_STRINGS.STRING_OPS_EXTENDED.SUBSTRING_START] : HARDCODED_STRINGS.EMAIL.USER;
    await sendPasswordResetConfirmation(user.email, userFirstName);

    logger.info(RESET_PASSWORD_SUCCESS, { 
      userId: user.id,
      email: user.email
    });

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      HARDCODED_STRINGS.PASSWORD_RESET_SUCCESS
    );

  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.RESET_PASSWORD_ERROR, error);
    return handleServiceError(error, 'resetPasswordService');
  }
};

/**
 * Sign Up Service - Legacy signup with modern enhancements
 */
export const signUpService = async (signUpData) => {
  try {
    const { name, email, password, phone_number, role_id } = signUpData;



    logger.info(AUTH_LOG_ACTIONS.SIGN_UP_ATTEMPT, { email });
    logger.info(SIGN_UP_ATTEMPT, { email });

    // Validate role
    // Note: Role validation removed - implement when role repository is available
    const roleDoc = null;
    if (!roleDoc) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.INVALID_ROLE_PROVIDED);
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        'Invalid role provided'
      );
    }

    // Check if user already exists
    const user = await authRepository.findUserByEmail(email);
    if (user) {
      logger.warn(USER_ALREADY_EXISTS, { email });
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        'User already exists'
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone_number,
      role_id,
      email_verified: false
    };

    const newUser = await authRepository.createUser(userData);

    // Create email verification token and send email
    const emailVerificationToken = await createEmailVerificationToken(newUser.id);
    await sendEmailVerification(newUser.email, emailVerificationToken, newUser.name);

    logger.info(SIGN_UP_SUCCESS, { 
      userId: newUser.id, 
      email: newUser.email 
    });

    return createServiceResponse(
      true,
      status.STATUS_CODE_CREATED,
      AUTH_MESSAGES.SIGNUP_SUCCESS,
      {
        message: HARDCODED_STRINGS.ACCOUNT_CREATED_SUCCESS_MESSAGE,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          email_verified: newUser.email_verified
        }
      }
    );

  } catch (error) {
    return handleServiceError(error, 'signUpService');
  }
};

/**
 * Get User Profile Service - Fetch user profile
 */
export const getUserProfileService = async (userId) => {
  try {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
USER_NOT_FOUND
      );
    }

    const { password, mfa_secret, ...userProfile } = user.toJSON();

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      HARDCODED_STRINGS.USER_PROFILE_RETRIEVED_SUCCESS,
      {
        user: {
          ...userProfile,
          role: {
            id: user.role?.id,
            name: user.role?.name,
            description: user.role?.description
          }
        }
      }
    );

  } catch (error) {
    return handleServiceError(error, 'getUserProfileService');
  }
};

/**
 * Change Password Service - Password change business logic
 */
export const changePasswordService = async (passwordData) => {
  try {
    const { userId, currentPassword, newPassword } = passwordData;

    // Get user and validate current password
    const user = await authRepository.findUserById(userId);
    if (!user) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_NOT_FOUND,
USER_NOT_FOUND
      );
    }

    const isCurrentPasswordValid = await validatePassword(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_BAD_REQUEST,
        AUTH_MESSAGES.INVALID_CURRENT_PASSWORD
      );
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await authRepository.updatePassword(userId, hashedPassword);

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESS
    );

  } catch (error) {
    return handleServiceError(error, 'changePasswordService');
  }
};

/**
 * Update User Profile Service - Profile update business logic
 */
export const updateUserProfileService = async (updateData) => {
  try {
    const { userId, updates, requesterId } = updateData;

    // Authorization check
    if (userId !== requesterId) {
      return createServiceResponse(
        false,
        status.STATUS_CODE_FORBIDDEN,
        HARDCODED_STRINGS.YOU_CAN_ONLY_UPDATE_YOUR_OWN_PROFILE
      );
    }

    // Remove sensitive fields
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.password;
    delete sanitizedUpdates.mfa_secret;
    delete sanitizedUpdates.email_verified;
    delete sanitizedUpdates.role_id; // Prevent role escalation

    await authRepository.updateUser(userId, sanitizedUpdates);

    return createServiceResponse(
      true,
      status.STATUS_CODE_SUCCESS,
      HARDCODED_STRINGS.PROFILE_UPDATE_SUCCESS
    );

  } catch (error) {
    return handleServiceError(error, 'updateUserProfileService');
  }
};

// TOKEN HELPER FUNCTIONS

const createInviteToken = async (inviteData) => {
  const { email, role_id, organization_id, tenant_id, invited_by } = inviteData;
  
  const inviteToken = uuidv4() + HARDCODED_STRINGS.STRING_OPS_EXTENDED.DASH + Date.now();
  const expiresAt = new Date(Date.now() + HARDCODED_STRINGS.TIME_VALUES.SEVEN_DAYS_MS); // 7 days

  const tokenData = await tokenRepository.create({
    userId: null,
    inviteToken,
    inviteTokenExpiresAt: expiresAt,
    tokenType: HARDCODED_STRINGS.TOKEN_TYPES_EXTENDED.INVITE,
    createdBy: invited_by,
    metadata: JSON.stringify({
      email,
      role_id,
      organization_id,
      tenant_id,
      invited_by
    })
  });

  logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.INVITE_TOKEN_CREATED, { 
    email, 
    tokenId: tokenData.id,
    expiresAt 
  });

  return inviteToken;
};

const validateInviteToken = async (inviteToken) => {
  try {
    const tokenData = await tokenRepository.find({
      inviteToken,
      revoked: false,
      inviteTokenExpiresAt: { $gt: new Date() }
    });

    if (!tokenData) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.INVALID_OR_EXPIRED_INVITE_TOKEN, { inviteToken });
      return null;
    }

    const metadata = JSON.parse(tokenData.metadata || HARDCODED_STRINGS.STRING_OPS_EXTENDED.EMPTY_JSON);
    
    return {
      tokenId: tokenData.id,
      email: metadata.email,
      role_id: metadata.role_id,
      organization_id: metadata.organization_id,
      tenant_id: metadata.tenant_id,
      invited_by: metadata.invited_by,
      created_at: tokenData.createdAt
    };
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.ERROR_VALIDATING_INVITE_TOKEN, { error: error.message });
    return null;
  }
};

const createEmailVerificationToken = async (userId) => {
  const emailVerificationToken = uuidv4() + HARDCODED_STRINGS.STRING_OPS_EXTENDED.DASH + Date.now();
  const expiresAt = new Date(Date.now() + HARDCODED_STRINGS.TIME_VALUES.TWENTY_FOUR_HOURS_MS); // 24 hours

  const tokenData = await tokenRepository.create({
    userId,
    emailVerificationToken,
    emailVerificationTokenExpiresAt: expiresAt,
    tokenType: HARDCODED_STRINGS.TOKEN_TYPES_EXTENDED.EMAIL_VERIFICATION
  });

  logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.EMAIL_VERIFICATION_TOKEN_CREATED, { 
    userId, 
    tokenId: tokenData.id,
    expiresAt 
  });

  return emailVerificationToken;
};

const validateEmailVerificationToken = async (emailVerificationToken) => {
  try {
    const tokenData = await tokenRepository.find({
      emailVerificationToken,
      revoked: false,
      emailVerificationTokenExpiresAt: { $gt: new Date() }
    });

    if (!tokenData) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.INVALID_OR_EXPIRED_EMAIL_VERIFICATION_TOKEN);
      return null;
    }

    return {
      tokenId: tokenData.id,
      userId: tokenData.userId
    };
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.ERROR_VALIDATING_EMAIL_VERIFICATION_TOKEN, { error: error.message });
    return null;
  }
};

const _validateResetToken = async (resetToken) => {
  try {
    const tokenData = await tokenRepository.find({
      resetToken,
      revoked: false,
      resetTokenExpiresAt: { $gt: new Date() }
    });

    if (!tokenData) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN);
      return null;
    }

    return {
      tokenId: tokenData.id,
      userId: tokenData.userId
    };
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.ERROR_VALIDATING_RESET_TOKEN, { error: error.message });
    return null;
  }
};

const setupUserMFA = async (userId, secret) => {
  try {
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }

    await authRepository.updateMFASettings(userId, {
      mfa_secret: secret,
      mfa_backup_codes: JSON.stringify(backupCodes),
      mfa_enabled: false
    });

    logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.MFA_SETUP_INITIATED, { userId });
    return { secret, backupCodes };
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.ERROR_SETTING_UP_MFA, { error: error.message });
    throw error;
  }
};

const verifyUserMFA = async (userId, code) => {
  try {
    const user = await authRepository.findUserById(userId);
    if (!user || !user.mfa_secret) {
      logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.USER_NOT_FOUND_OR_MFA_NOT_SETUP, { userId });
      return false;
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: HARDCODED_STRINGS.MFA_CONFIG.BASE32,
      token: code,
      window: HARDCODED_STRINGS.MFA_CONFIG.WINDOW
    });

    if (verified) {
      logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.MFA_VERIFICATION_SUCCESS, { userId });
      return true;
    }

    if (user.mfa_backup_codes) {
      const backupCodes = JSON.parse(user.mfa_backup_codes);
      const codeIndex = backupCodes.indexOf(code.toUpperCase());
      
      if (codeIndex !== -1) {
        backupCodes.splice(codeIndex, 1);
        await authRepository.updateMFASettings(userId, {
          mfa_backup_codes: JSON.stringify(backupCodes)
        });
        
        logger.info(HARDCODED_STRINGS.SERVICE_MESSAGES.MFA_BACKUP_CODE_VERIFICATION_SUCCESS, { userId });
        return true;
      }
    }

    logger.warn(HARDCODED_STRINGS.SERVICE_MESSAGES.MFA_VERIFICATION_FAILED, { userId });
    return false;
  } catch (error) {
    logger.error(HARDCODED_STRINGS.SERVICE_MESSAGES.ERROR_VERIFYING_MFA, { error: error.message });
    return false;
  }
};
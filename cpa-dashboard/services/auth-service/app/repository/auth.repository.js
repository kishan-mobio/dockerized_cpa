import { AppUser } from '../models/index.js';
import { 
  create, 
  update, 
  findAll
} from '../utils/database.utils.js';
import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES, LOGGER_MESSAGES } from '../utils/constants/log.constants.js';

const logger = createLogger(LOGGER_NAMES.AUTH_REPOSITORY);


export const authRepository = {
  /**
   * Create a new user for authentication purposes
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {



    // Map old field names to new schema
    const mappedData = {
      ...userData,
      password_hash: userData.password, // Map password to password_hash
      full_name: userData.name, // Map name to full_name
    };
    delete mappedData.password;
    delete mappedData.name;
    
    return await create(AppUser, mappedData);




    try {
      // Map old field names to new schema
      const mappedData = {
        ...userData,
        password_hash: userData.password, // Map password to password_hash
        full_name: userData.name, // Map name to full_name
      };
      delete mappedData.password;
      delete mappedData.name;
      
      return await create(AppUser, mappedData);
    } catch (error) {
      logger.error(LOGGER_MESSAGES.ERROR.REPOSITORY.CREATE_USER_ERROR, {
        error: error.message,
        stack: error.stack,
        userData: { email: userData?.email, name: userData?.name }
      });
      throw error;
    }






  },

  /**
   * Find user by email (primary authentication lookup)
   * @param {string} email - User email
   * @param {Array} include - Associations to include (roles, organizations, etc.)
   * @returns {Promise<Object|null>} User object or null
   */
  async findUserByEmail(email, include = []) {



    return await AppUser.findOne({
      where: { 
        email,
        is_active: true // Use is_active instead of is_deleted
      },
      include
    });




    try {
      return await AppUser.findOne({
        where: { 
          email,
          is_active: true // Use is_active instead of is_deleted
        },
        include
      });
    } catch (error) {
      logger.error(LOGGER_MESSAGES.ERROR.REPOSITORY.FIND_USER_BY_EMAIL_ERROR, {
        error: error.message,
        stack: error.stack,
        email
      });
      throw error;
    }






  },

  /**
   * Find user by ID for authentication operations
   * @param {number} userId - User ID
   * @param {Array} include - Associations to include
   * @returns {Promise<Object|null>} User object or null
   */
  async findUserById(userId, include = []) {



    return await AppUser.findOne({
      where: { 
        id: userId,
        is_active: true // Use is_active instead of is_deleted
      },
      include
    });




    try {
      return await AppUser.findOne({
        where: { 
          id: userId,
          is_active: true // Use is_active instead of is_deleted
        },
        include
      });
    } catch (error) {
      logger.error(LOGGER_MESSAGES.ERROR.REPOSITORY.FIND_USER_BY_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        userId
      });
      throw error;
    }






  },

  /**
   * Find user with flexible filtering for authentication
   * @param {Object} filter - Filter options
   * @param {number} filter.id - User ID
   * @param {string} filter.email - User email
   * @param {boolean} filter.is_active - User active status
   * @param {boolean} filter.email_verified - Email verification status
   * @param {Array} filter.include - Associations to include
   * @param {Array} filter.attributes - Attributes to select
   * @returns {Promise<Object|null>} User object or null
   */
  async findUser(filter = {}) {
    const { 
      id, 
      email, 
      is_active, 
      email_verified,
      include = [],
      attributes,
      ...otherFilters
    } = filter;

    // Build where conditions
    const where = {};
    
    if (id) where.id = id;
    if (email) where.email = email;
    if (is_active !== undefined) where.is_active = is_active;
    if (email_verified !== undefined) where.email_verified = email_verified;
    
    // Add any other filters
    Object.assign(where, otherFilters);

    return await AppUser.findOne({ where, include, attributes });
  },

  /**
   * Update user authentication-related data
   * @param {number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateUser(userId, updateData) {
    // Map old field names to new schema if needed
    const mappedData = { ...updateData };
    if (mappedData.password) {
      mappedData.password_hash = mappedData.password;
      delete mappedData.password;
    }
    if (mappedData.name) {
      mappedData.full_name = mappedData.name;
      delete mappedData.name;
    }
    
    return await update(AppUser, userId, mappedData);
  },

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updatePassword(userId, hashedPassword) {
    return await update(AppUser, userId, { password_hash: hashedPassword });
  },

  /**
   * Update user email verification status
   * @param {number} userId - User ID
   * @param {boolean} verified - Verification status
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateEmailVerification(userId, verified = true) {
    const updateData = {
      email_verified: verified,
      email_verified_at: verified ? new Date() : null
    };
    return await update(AppUser, userId, updateData);
  },

  /**
   * Update user MFA settings
   * @param {number} userId - User ID
   * @param {Object} mfaData - MFA configuration data
   * @param {string} mfaData.mfa_secret - MFA secret
   * @param {boolean} mfaData.mfa_enabled - MFA enabled status
   * @param {string} mfaData.mfa_backup_codes - JSON string of backup codes
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateMFASettings(userId, mfaData) {
    const updateData = {};
    
    if (mfaData.mfa_secret !== undefined) updateData.mfa_secret = mfaData.mfa_secret;
    if (mfaData.mfa_enabled !== undefined) updateData.mfa_enabled = mfaData.mfa_enabled;
    if (mfaData.mfa_backup_codes !== undefined) updateData.mfa_backup_codes = mfaData.mfa_backup_codes;
    
    return await update(AppUser, userId, updateData);
  },

  /**
   * Update user last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateLastLogin(userId) {
    return await update(AppUser, userId, { last_login: new Date() });
  },

  /**
   * Update user invitation data
   * @param {number} userId - User ID
   * @param {Object} inviteData - Invitation data
   * @param {number} inviteData.invited_by - ID of user who sent invitation
   * @param {Date} inviteData.invited_at - Invitation timestamp
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateInvitationData(userId, inviteData) {
    return await update(AppUser, userId, inviteData);
  },

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  async userExists(email) {
    const user = await AppUser.findOne({
      where: { 
        email,
        is_active: true 
      },
      attributes: ['id']
    });
    return !!user;
  },

  /**
   * Get user count for analytics/monitoring
   * @param {Object} filter - Filter options
   * @param {boolean} filter.is_active - Active users only
   * @param {boolean} filter.email_verified - Verified users only
   * @param {boolean} filter.mfa_enabled - MFA enabled users only
   * @returns {Promise<number>} User count
   */
  async getUserCount(filter = {}) {
    const where = {};
    
    if (filter.is_active !== undefined) where.is_active = filter.is_active;
    if (filter.email_verified !== undefined) where.email_verified = filter.email_verified;
    if (filter.mfa_enabled !== undefined) where.mfa_enabled = filter.mfa_enabled;

    const users = await findAll(AppUser, { 
      where, 
      attributes: ['id']
    });
    
    return users.length;
  },

  /**
   * Soft delete user (deactivate account)
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deactivateUser(userId) {
    return await update(AppUser, userId, { is_active: false });
  },

};

export default authRepository;

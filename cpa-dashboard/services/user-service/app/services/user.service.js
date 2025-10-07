import { userRepository } from "../repositories/user.repository.js";
import {
  LOG_ACTIONS,
  USER_MESSAGES,
  ERROR_CODES,
  LOGGER_NAMES,
  MODEL_FIELDS,
} from "../utils/constants.util.js";
import { hashPassword } from "../utils/methods.util.js";
import { createLogger } from "../utils/logger.util.js";

const logger = createLogger(LOGGER_NAMES.USER_SERVICE);

/**
 * User Service
 * Business logic for user operations
 * Optimized to use centralized db_operations and constants
 */
export const userService = {
  /**
   * Create a new user with validation and business logic
   * @param {Object} userData - User data including role_id, organization_id, tenant_id
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    logger.info(LOG_ACTIONS.CREATING);

    // Validate required fields
    if (!userData[MODEL_FIELDS.EMAIL]) {
      const error = new Error(USER_MESSAGES.EMAIL_REQUIRED);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    if (!userData[MODEL_FIELDS.PASSWORD]) {
      const error = new Error(USER_MESSAGES.PASSWORD_REQUIRED);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    if (!userData[MODEL_FIELDS.FULL_NAME]) {
      const error = new Error(USER_MESSAGES.NAME_REQUIRED);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    // Check for duplicate email using repository
    const emailExists = await userRepository.emailExists(
      userData[MODEL_FIELDS.EMAIL]
    );
    if (emailExists) {
      logger.warn(LOG_ACTIONS.ALREADY_EXISTS);
      const error = new Error(USER_MESSAGES.ALREADY_EXISTS_ERROR);
      error.code = ERROR_CODES.DUPLICATE_ERROR;
      throw error;
    }

    // Prepare complete user data
    const completeUserData = {
      ...userData,
      [MODEL_FIELDS.PASSWORD_HASH]: await hashPassword(
        userData[MODEL_FIELDS.PASSWORD]
      ),
    };

    // Create user using repository
    const newUser = await userRepository.create(completeUserData);

    logger.info(LOG_ACTIONS.CREATED_SUCCESS);
    return newUser;
  },

  /**
   * Get all users with pagination support
   * @param {Object} options - Query options including pagination
   * @returns {Promise<Object>} Paginated users result
   */
  async getAllUsers(options = {}) {
    logger.info(LOG_ACTIONS.FETCHING_ALL);

    // Set default pagination values
    const { page = 1, pageSize = 10, ...otherOptions } = options;

    // Use repository for pagination with proper options
    const result = await userRepository.findPaginated({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      where: { [MODEL_FIELDS.IS_DELETED]: false },
      ...otherOptions,
    });

    logger.info(
      `${LOG_ACTIONS.FETCHED_SUCCESSFULLY}: ${result.data.length} users`
    );
    return result;
  },

  /**
   * Get user by ID with associations
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User or null
   */
  async getUserById(id) {
    logger.info(LOG_ACTIONS.FETCHING_BY_ID);

    // Get user using repository with associations
    const user = await userRepository.findByField({ id });

    if (user) {
      logger.info(`${LOG_ACTIONS.FETCHED_SUCCESSFULLY}: ID ${id}`);
      return user;
    } else {
      const error = new Error(USER_MESSAGES.NOT_FOUND);
      error.code = ERROR_CODES.NOT_FOUND_ERROR;
      throw error;
    }
  },

  /**
   * Update user by ID
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateUser(id, updateData) {
    logger.info(LOG_ACTIONS.UPDATING);

    // Check if user exists
    const userExists = await userRepository.exists(id);
    if (!userExists) {
      const error = new Error(USER_MESSAGES.NOT_FOUND_OR_DELETED);
      error.code = ERROR_CODES.NOT_FOUND_ERROR;
      throw error;
    }

    // Check for duplicate email if email is being updated
    if (updateData[MODEL_FIELDS.EMAIL]) {
      const emailExists = await userRepository.emailExists(
        updateData[MODEL_FIELDS.EMAIL]
      );
      if (emailExists) {
        const error = new Error(USER_MESSAGES.ALREADY_EXISTS_ERROR);
        error.code = ERROR_CODES.DUPLICATE_ERROR;
        throw error;
      }
    }

    // Hash password if provided
    if (updateData[MODEL_FIELDS.PASSWORD]) {
      updateData[MODEL_FIELDS.PASSWORD] = await hashPassword(
        updateData[MODEL_FIELDS.PASSWORD]
      );
    }
    // Update user using repository
    const updatedUser = await userRepository.updateById(id, updateData);

    if (updatedUser) {
      logger.info(LOG_ACTIONS.UPDATED_SUCCESS);
    } else {
      logger.warn(LOG_ACTIONS.NOT_FOUND);
    }

    return updatedUser;
  },

  /**
   * Soft delete user by ID
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUser(id) {
    logger.info(LOG_ACTIONS.DELETING);

    // Check if user exists
    const userExists = await userRepository.exists(id);
    if (!userExists) {
      const error = new Error(USER_MESSAGES.NOT_FOUND_OR_DELETED);
      error.code = ERROR_CODES.NOT_FOUND_ERROR;
      throw error;
    }

    // Soft delete user using repository
    const success = await userRepository.softDeleteById(id);

    if (success) {
      logger.info(LOG_ACTIONS.DELETED_SUCCESS);
    } else {
      logger.warn(LOG_ACTIONS.NOT_FOUND);
    }

    return success;
  },

  /**
   * Check if user exists and is not deleted
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Existence status
   */
  async userExists(id) {
    // Validate ID
    if (!id || isNaN(id)) {
      const error = new Error(USER_MESSAGES.INVALID_USER_ID);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    // Check existence using repository
    const exists = await userRepository.exists(parseInt(id));
    return exists;
  },

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  async getUserByEmail(email) {
    logger.info(LOG_ACTIONS.FETCHING_BY_EMAIL);

    // Validate email
    if (!email) {
      const error = new Error(USER_MESSAGES.EMAIL_REQUIRED);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    // Get user by email using repository
    const user = await userRepository.findByField({ email });

    if (user) {
      logger.info(LOG_ACTIONS.FETCHED_EMAIL);
    } else {
      logger.warn(LOG_ACTIONS.NOT_FOUND_EMAIL);
    }

    return user;
  },

  /**
   * Update user password
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateUserPassword(id, newPassword, _options = {}) {
    logger.info(LOG_ACTIONS.UPDATING_PASSWORD);

    // Validate ID and password
    if (!id || isNaN(id)) {
      const error = new Error(USER_MESSAGES.INVALID_USER_ID);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    if (!newPassword) {
      const error = new Error(USER_MESSAGES.PASSWORD_REQUIRED);
      error.code = ERROR_CODES.VALIDATION_ERROR;
      throw error;
    }

    // Check if user exists
    const userExists = await userRepository.exists(parseInt(id));
    if (!userExists) {
      const error = new Error(USER_MESSAGES.NOT_FOUND_OR_DELETED);
      error.code = ERROR_CODES.NOT_FOUND_ERROR;
      throw error;
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    const updateData = {
      password: hashedPassword,
      updated_at: new Date(),
    };

    // Update password using repository
    const updatedUser = await userRepository.updateById(id, updateData);
    return updatedUser;
  },
};

export default userService;

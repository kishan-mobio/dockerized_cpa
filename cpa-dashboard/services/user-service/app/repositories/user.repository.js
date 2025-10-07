import {
  create,
  findOne,
  update,
  softDelete,
  findAll,
  paginate,
  exists,
  count,
} from "../utils/db.util.js";
import { SEQUELIZE_OPERATORS, MODEL_FIELDS } from "../utils/constants.util.js";
import { AppUser } from "../models/index.model.js";

export const userRepository = {
  /**
   * Create a new user
   * @param {Object} userData - AppUser data to create
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    return await create(AppUser, userData);
  },

  /**
   * Find users with flexible filtering
   * @param {Object} filter - Filter options
   * @param {number} filter.id - AppUser ID
   * @param {string} filter.email - AppUser email
   * @param {string} filter.name - AppUser name
   * @param {number} filter.tenant_id - Tenant ID
   * @param {number} filter.organization_id - Organization ID
   * @param {boolean} filter.is_active - AppUser active status
   * @param {boolean} filter.is_deleted - AppUser deleted status
   * @returns {Promise<Array>} Array of users
   */
  async findMany(filter = {}) {
    return await findAll(AppUser, { where: filter });
  },

  /**
   * Find user by field
   * @param {Object} where - Where conditions
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} AppUser or null
   */
  async findByField(where, options = {}) {
    return await findOne(AppUser, { where }, options);
  },

  /**
   * Soft delete user by ID
   * @param {number} id - AppUser ID
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Success status
   */
  async softDeleteById(id, options = {}) {
    return await softDelete(AppUser, id, options);
  },

  /**
   * Get paginated users
   * @param {Object} options - Pagination and filter options
   * @param {number} options.page - Page number
   * @param {number} options.pageSize - Page size
   * @param {Object} options.where - Where conditions
   * @param {Array} options.order - Order conditions
   * @param {Array} options.include - Include associations
   * @returns {Promise<Object>} Paginated result
   */
  async findPaginated(options = {}) {
    return await paginate(AppUser, options);
  },

  /**
   * Check if user exists
   * @param {number} id - AppUser ID
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id, options = {}) {
    return await exists(AppUser, id, options);
  },

  /**
   * Check if user with email exists (excluding deleted)
   * @param {string} email - AppUser email
   * @param {number} excludeId - ID to exclude from check
   * @returns {Promise<boolean>} Existence status
   */
  async emailExists(email) {
    const where = {
      [MODEL_FIELDS.EMAIL]: email,
      [MODEL_FIELDS.IS_DELETED]: false,
    };

    const user = await findOne(AppUser, { where });
    return !!user;
  },

  /**
   * Count users
   * @param {Object} whereConditions - Where conditions
   * @param {Object} options - Additional options
   * @returns {Promise<number>} Count of users
   */
  async count(whereConditions = {}, options = {}) {
    return await count(AppUser, { where: whereConditions, ...options });
  },

  /**
   * Get all active users
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of active users
   */
  async findActive(options = {}) {
    return await findAll(AppUser, {
      where: {
        is_active: true,
        is_deleted: false,
      },
      ...options,
    });
  },

  /**
   * Update user by ID
   * @param {number} id - AppUser ID
   * @param {Object} updateData - Data to update
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateById(id, updateData, options = {}) {
    return await update(AppUser, id, updateData, options);
  },

  /**
   * Hard delete user (permanent)
   * @param {number} id - AppUser ID
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Success status
   */
  async hardDelete(id, options = {}) {
    try {
      await AppUser.destroy({
        where: { id },
        force: true,
        ...options,
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user statistics
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} AppUser statistics
   */
  async getStatistics(options = {}) {
    const totalAppUsers = await this.count({ is_deleted: false }, options);
    const activeAppUsers = await this.count(
      { is_active: true, is_deleted: false },
      options
    );
    const inactiveAppUsers = totalAppUsers - activeAppUsers;

    return {
      totalAppUsers,
      activeAppUsers,
      inactiveAppUsers,
    };
  },

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of matching users
   */
  async searchAppUsers(searchTerm, options = {}) {
    return await findAll(AppUser, {
      where: {
        [require("sequelize").Op[SEQUELIZE_OPERATORS.OR]]: [
          {
            name: {
              [require("sequelize").Op[
                SEQUELIZE_OPERATORS.LIKE
              ]]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [require("sequelize").Op[
                SEQUELIZE_OPERATORS.LIKE
              ]]: `%${searchTerm}%`,
            },
          },
        ],
        is_deleted: false,
      },
      ...options,
    });
  },

  /**
   * Get recently active users
   * @param {number} days - Number of days to look back
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of recently active users
   */
  async getRecentlyActiveAppUsers(days = 7, options = {}) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await findAll(AppUser, {
      where: {
        last_login: {
          [require("sequelize").Op[SEQUELIZE_OPERATORS.GTE]]: dateThreshold,
        },
        is_deleted: false,
      },
      order: [["last_login", "DESC"]],
      ...options,
    });
  },
};

export default userRepository;

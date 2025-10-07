
import { AppToken } from '../models/index.js';

import { 
  create, 
  findById, 
  findOne, 
  update, 
  findAll
} from '../utils/database.utils.js';

export const tokenRepository = {
  /**
   * Create a new token
   * @param {Object} tokenData - Token data to create
   * @returns {Promise<Object>} Created token
   */
  async create(tokenData) {
    return await create(AppToken, tokenData);
  },

  /**
   * Find tokens with flexible filtering
   * @param {Object} filter - Filter options
   * @param {number} filter.id - Token ID
   * @param {string} filter.token - Token string
   * @param {string} filter.type - Token type (refresh, reset, etc.)
   * @param {number} filter.userId - User ID
   * @param {boolean} filter.revoked - Token revoked status
   * @param {boolean} filter.used - Token used status
   * @param {Array} filter.include - Associations to include
   * @param {Object} filter.pagination - Pagination options
   * @param {number} filter.pagination.page - Page number
   * @param {number} filter.pagination.limit - Records per page
   * @param {Array} filter.order - Order by conditions
   * @param {Array} filter.attributes - Attributes to select
   * @returns {Promise<Object|Array>} Token(s) or paginated result
   */
  async find(filter = {}) {
    const { 
      id, 
      token, 
      type, 
      userId, 
      revoked, 
      used,
      include = [],
      pagination,
      order = [['created_at', 'ASC']],
      attributes,
      ...otherFilters
    } = filter;

    // Build where conditions
    const where = {};
    
    if (id) where.id = id;
    if (token) where.token = token;
    if (type) where.type = type;
    if (userId) where.userId = userId;
    if (revoked !== undefined) where.revoked = revoked;
    if (used !== undefined) where.used = used;
    
    // Add any other filters
    Object.assign(where, otherFilters);

    // If pagination is requested, use paginate function
    if (pagination) {
      return await findAll(AppToken, {
        where,
        include,
        order,
        attributes,
        ...pagination
      });
    }

    // If ID is provided, use findById for single record
    if (id) {
      return await findById(AppToken, id, { include, order, attributes });
    }

    // If token is provided, use findOne for single record
    if (token && !pagination) {
      return await findOne(AppToken, { where, include, order, attributes });
    }

    // Otherwise, use findAll for multiple records
    return await findAll(AppToken, { where, include, order, attributes });
  },

  /**
   * Update token by ID or filter
   * @param {Object|number} identifier - Token ID or filter object
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated token or null
   */
  async update(identifier, updateData) {
    if (typeof identifier === 'number') {
      // Update by ID
      return await update(AppToken, identifier, updateData);
    } else {
      // Update by filter
      const { where, ...otherOptions } = identifier;
      const result = await findOne(AppToken, { where, ...otherOptions });
      if (result) {
        return await update(AppToken, result.id, updateData);
      }
      return null;
    }
  },

  /**
   * Soft delete token by ID or filter
   * @param {Object|number} identifier - Token ID or filter object
   * @returns {Promise<boolean>} Success status
   */
  async softDelete(identifier) {
    if (typeof identifier === 'number') {
      // Delete by ID (mark as revoked)
      return await update(AppToken, identifier, { revoked: true, revoked_at: new Date() });
    } else {
      // Delete by filter
      const { where, ...otherOptions } = identifier;
      const result = await findOne(AppToken, { where, ...otherOptions });
      if (result) {
        return await update(AppToken, result.id, { revoked: true, revoked_at: new Date() });
      }
      return false;
    }
  },

  /**
   * Revoke token by token string and type
   * @param {string} token - Token string
   * @param {string} type - Token type
   * @returns {Promise<number>} Number of affected rows
   */
  async revokeToken(token, type) {
    return await bulkUpdate(AppToken, 
      { revoked: true, revoked_at: new Date() },
      { token_hash: token, token_type: type }
    );
  },

  /**
   * Revoke all tokens for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of affected rows
   */
  async revokeAllUserTokens(userId) {
    return await bulkUpdate(AppToken, 
      { revoked: true, revoked_at: new Date() }, 
      { user_id: userId, revoked: false }
    );
  }
};

export default tokenRepository;

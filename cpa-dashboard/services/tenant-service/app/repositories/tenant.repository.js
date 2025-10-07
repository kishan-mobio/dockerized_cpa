import {
  create,
  findOne,
  update,
  softDelete,
  findAll,
  paginate,
  exists,
  count,
} from "../utils/database.util.js";
import { SEQUELIZE_OPERATORS, MODEL_FIELDS } from "../utils/constants.util.js";
import { Tenant } from "../models/index.js";

export const tenantRepository = {
  /**
   * Create a new tenant
   * @param {Object} tenantData - Tenant data to create
   * @returns {Promise<Object>} Created tenant
   */
  async create(tenantData) {
    return await create(Tenant, tenantData);
  },

  /**
   * Find tenants with flexible filtering
   * @param {Object} filter - Filter options
   * @param {string} filter.id - Tenant ID
   * @param {string} filter.name - Tenant name
   * @param {string} filter.subdomain - Tenant subdomain
   * @param {string} filter.country_id - Country ID
   * @param {string} filter.currency_id - Currency ID
   * @param {boolean} filter.is_active - Tenant active status
   * @param {boolean} filter.is_deleted - Tenant deleted status
   * @returns {Promise<Array>} Array of tenants
   */
  async findMany(filter = {}) {
    return await findAll(Tenant, { where: filter });
  },

  /**
   * Find tenant by field
   * @param {Object} where - Where conditions
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Tenant or null
   */
  async findByField(where, options = {}) {
    return await findOne(Tenant, { where }, options);
  },

  /**
   * Update tenant by ID
   * @param {string} id - Tenant ID
   * @param {Object} updateData - Data to update
   * @param {Object} options - Additional options
   * @returns {Promise<Object|null>} Updated tenant or null
   */
  async updateById(id, updateData, options = {}) {
    return await update(Tenant, id, updateData, options);
  },

  /**
   * Soft delete tenant by ID
   * @param {string} id - Tenant ID
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} Success status
   */
  async deleteById(id, options = {}) {
    return await softDelete(Tenant, id, options);
  },

  /**
   * Check if tenant exists by ID
   * @param {string} id - Tenant ID
   * @returns {Promise<boolean>} Existence status
   */
  async existsById(id) {
    return await exists(Tenant, { [MODEL_FIELDS.ID]: id });
  },

  /**
   * Get total count of tenants
   * @param {Object} filter - Filter conditions
   * @returns {Promise<number>} Count of tenants
   */
  async count(filter = {}) {
    return await count(Tenant, filter);
  },

  /**
   * Get paginated tenants
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Paginated results
   */
  async paginate(options = {}) {
    return await paginate(Tenant, options);
  },

  /**
   * Search tenants by name or subdomain
   * @param {string} searchTerm - Search term
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of matching tenants
   */
  async search(searchTerm, options = {}) {
    return await findAll(Tenant, {
      where: {
        [SEQUELIZE_OPERATORS.OR]: [
          {
            [MODEL_FIELDS.NAME]: {
              [SEQUELIZE_OPERATORS.ILIKE]: `%${searchTerm}%`,
            },
          },
          {
            [MODEL_FIELDS.SUBDOMAIN]: {
              [SEQUELIZE_OPERATORS.ILIKE]: `%${searchTerm}%`,
            },
          },
        ],
      },
      ...options,
    });
  },
};

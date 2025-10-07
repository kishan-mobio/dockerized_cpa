import { tenantRepository } from "../repositories/tenant.repository.js";
import {
  LOG_ACTIONS,
  TENANT_MESSAGES,
  ERROR_CODES,
  LOGGER_NAMES,
} from "../utils/constants.util.js";
import { throwError } from "../utils/methods.util.js";
import { createLogger } from "../utils/logger.util.js";

const logger = createLogger(LOGGER_NAMES.TENANT_SERVICE);

/**
 * Tenant Service
 * Business logic for tenant operations
 * Optimized to use centralized db_operations and constants
 */
export const tenantService = {
  /**
   * Create a new tenant with validation and business logic
   * @param {Object} tenantData - Tenant data
   * @returns {Promise<Object>} Created tenant
   */
  async createTenant(tenantData) {
    logger.info(LOG_ACTIONS.CREATING);

    // Create tenant using repository
    const newTenant = await tenantRepository.create(tenantData);
    logger.info(LOG_ACTIONS.CREATED_SUCCESS);
    return newTenant;
  },

  /**
   * Get all tenants with optional filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Tenants with pagination info
   */
  async getAllTenants(options = {}) {
    logger.info(LOG_ACTIONS.FETCHING_ALL);

    const { page = 1, pageSize = 10, ...otherOptions } = options;

    // Get paginated results
    const result = await tenantRepository.paginate({
      page,
      pageSize,
      ...otherOptions,
    });

    logger.info(LOG_ACTIONS.FETCHED_SUCCESSFULLY);
    return result;
  },

  /**
   * Get tenant by ID
   * @param {string} id - Tenant ID
   * @returns {Promise<Object|null>} Tenant or null
   */
  async getTenantById(id) {
    logger.info(LOG_ACTIONS.FETCHING_BY_ID);

    if (!id) {
      throwError(
        TENANT_MESSAGES.INVALID_TENANT_ID,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const tenant = await tenantRepository.findByField({ id });

    if (!tenant) {
      logger.warn(LOG_ACTIONS.NOT_FOUND);
      throwError(TENANT_MESSAGES.NOT_FOUND, ERROR_CODES.NOT_FOUND_ERROR);
    }

    logger.info(LOG_ACTIONS.FETCHED_SUCCESSFULLY);
    return tenant;
  },

  /**
   * Update tenant by ID
   * @param {string} id - Tenant ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated tenant or null
   */
  async updateTenant(id, updateData) {
    logger.info(LOG_ACTIONS.UPDATING);

    if (!id) {
      throwError(
        TENANT_MESSAGES.INVALID_TENANT_ID,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // Check if tenant exists
    const existingTenant = await tenantRepository.findByField({ id });
    if (!existingTenant) {
      logger.warn(LOG_ACTIONS.NOT_FOUND);
      throwError(TENANT_MESSAGES.NOT_FOUND, ERROR_CODES.NOT_FOUND_ERROR);
    }

    // Update tenant using repository
    const updatedTenant = await tenantRepository.updateById(id, updateData);

    logger.info(LOG_ACTIONS.UPDATED_SUCCESS);
    return updatedTenant;
  },

  /**
   * Delete tenant by ID (soft delete)
   * @param {string} id - Tenant ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTenant(id) {
    logger.info(LOG_ACTIONS.DELETING);

    if (!id) {
      throwError(
        TENANT_MESSAGES.INVALID_TENANT_ID,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // Check if tenant exists
    const existingTenant = await tenantRepository.findByField({ id });
    if (!existingTenant) {
      logger.warn(LOG_ACTIONS.NOT_FOUND);
      throwError(TENANT_MESSAGES.NOT_FOUND, ERROR_CODES.NOT_FOUND_ERROR);
    }

    // Soft delete tenant using repository
    const deleted = await tenantRepository.deleteById(id);

    logger.info(LOG_ACTIONS.DELETED_SUCCESS);
    return deleted;
  },
};

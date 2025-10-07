import { tenantService } from "../services/tenant.service.js";
import { errorResponse, successResponse } from "../utils/response.util.js";
import { errorHandler } from "../utils/error.util.js";
import { createLogger } from "../utils/logger.util.js";
import {
  STATUS_CODE_SUCCESS,
  STATUS_CODE_CREATED,
} from "../utils/status_code.util.js";
import {
  MODULES,
  OPERATIONS,
  TENANT_MESSAGES,
  LOGGER_NAMES,
  LOG_ACTIONS,
} from "../utils/constants.util.js";

const logger = createLogger(LOGGER_NAMES.TENANT_CONTROLLER);

/**
 * Create a new tenant
 * @route POST /api/tenants
 * @access Admin only
 */
export const createTenant = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.CREATING);

    // Extract data from request
    const tenantData = req.body;
    tenantData.created_by = req.user?.id;

    // Call service method which handles all business logic
    const newTenant = await tenantService.createTenant(tenantData);

    // Return HTTP response
    return res
      .status(STATUS_CODE_CREATED)
      .json(successResponse(TENANT_MESSAGES.CREATED_SUCCESSFULLY, newTenant));
  } catch (error) {
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.TENANT,
      OPERATIONS.CREATE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Get all tenants with pagination
 * @route GET /api/tenants
 * @access Admin only
 */
export const getAllTenants = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.FETCHING_ALL);

    // Extract query parameters
    const { page = 1, pageSize = 10, ...otherParams } = req.query;

    // Call service method with query parameters
    const result = await tenantService.getAllTenants({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      ...otherParams,
    });

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(successResponse(TENANT_MESSAGES.FETCHED_SUCCESSFULLY, result));
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.TENANT,
      OPERATIONS.GET_ALL
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Get tenant by ID
 * @route GET /api/tenants/:id
 * @access Admin only
 */
export const getTenantById = async (req, res) => {
  try {
    // Extract data from request
    const { id } = req.params;

    logger.info(LOG_ACTIONS.FETCHING_BY_ID);

    // Call service method which handles all business logic
    const tenant = await tenantService.getTenantById(id);

    if (!tenant) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.TENANT, MODULES.TENANT);
      return res.status(errorStatus).json(errorResponse(response));
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(TENANT_MESSAGES.TENANT_FETCHED_SUCCESSFULLY, tenant)
      );
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.TENANT,
      OPERATIONS.GET_BY_ID
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Update tenant by ID
 * @route PUT /api/tenants/:id
 * @access Admin only
 */
export const updateTenant = async (req, res) => {
  try {
    // Extract data from request
    const { id } = req.params;
    const tenantData = req.body;
    tenantData.updated_by = req.user?.id;

    logger.info(LOG_ACTIONS.UPDATING);

    // Call service method which handles all business logic
    const updatedTenant = await tenantService.updateTenant(id, tenantData);

    if (!updatedTenant) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.TENANT, MODULES.TENANT);
      return res.status(errorStatus).json(errorResponse(response));
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(TENANT_MESSAGES.UPDATED_SUCCESSFULLY, updatedTenant)
      );
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.TENANT,
      OPERATIONS.UPDATE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Delete tenant by ID (soft delete)
 * @route DELETE /api/tenants/:id
 * @access Admin only
 */
export const deleteTenant = async (req, res) => {
  try {
    // Extract data from request
    const { id } = req.params;

    logger.info(LOG_ACTIONS.DELETING);

    // Call service method which handles all business logic
    const deleted = await tenantService.deleteTenant(id);

    if (!deleted) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.TENANT, MODULES.TENANT);
      return res.status(errorStatus).json(errorResponse(response));
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(TENANT_MESSAGES.DELETED_SUCCESSFULLY, { deleted: true })
      );
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.TENANT,
      OPERATIONS.DELETE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

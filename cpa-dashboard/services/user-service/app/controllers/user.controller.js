import { userService } from "../services/user.service.js";
import {
  errorResponse,
  successResponse,
  throwCustomErrorWithStatus,
} from "../utils/response.util.js";
import { errorHandler } from "../utils/error.util.js";
import { createLogger } from "../utils/logger.util.js";
import {
  STATUS_CODE_SUCCESS,
  STATUS_CODE_CREATED,
} from "../utils/status_code.util.js";
import { MODULES, OPERATIONS, USER_MESSAGES } from "../utils/constants.util.js";
import { LOGGER_NAMES, LOG_ACTIONS } from "../utils/constants.util.js";

const logger = createLogger(LOGGER_NAMES.USER_CONTROLLER);

/**
 * Create a new user
 * @route POST /api/users
 * @access Admin only
 */
export const createUser = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.CREATING);

    // Extract data from request
    const userData = req.body;
    userData.created_by = req.user?.id;

    // Call service method which handles all business logic
    const newUser = await userService.createUser(userData);

    // Return HTTP response
    return res
      .status(STATUS_CODE_CREATED)
      .json(successResponse(USER_MESSAGES.CREATED_SUCCESSFULLY, newUser));
  } catch (error) {
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.USER,
      OPERATIONS.CREATE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Get all users with pagination
 * @route GET /api/users
 * @access Admin only
 */
export const getAllUsers = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.FETCHING_ALL);

    // Extract query parameters
    const { page = 1, pageSize = 10, ...otherParams } = req.query;

    // Call service method with query parameters
    const result = await userService.getAllUsers({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      ...otherParams,
    });

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(successResponse(USER_MESSAGES.FETCHED_SUCCESSFULLY, result));
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.USER,
      OPERATIONS.GET_ALL
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Admin only
 */
export const getUserById = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    logger.info(LOG_ACTIONS.FETCHING_BY_ID);

    // Call service method
    const user = await userService.getUserById(id);

    if (!user) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.USER, MODULES.USER);
      throwCustomErrorWithStatus(response, errorStatus);
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(successResponse(USER_MESSAGES.FETCHED_SUCCESSFULLY, user));
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.USER,
      OPERATIONS.GET_BY_ID
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Update user by ID
 * @route PUT /api/users/:id
 * @access Admin only
 */
export const updateUser = async (req, res) => {
  try {
    // Extract data from request
    const { id } = req.params;
    const userData = req.body;
    userData.updated_by = req.user?.id;

    logger.info(LOG_ACTIONS.UPDATING);

    // Call service method which handles all business logic
    const updatedUser = await userService.updateUser(id, userData);

    if (!updatedUser) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.USER, MODULES.USER);
      throwCustomErrorWithStatus(response, errorStatus);
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(successResponse(USER_MESSAGES.UPDATED_SUCCESSFULLY, updatedUser));
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.USER,
      OPERATIONS.UPDATE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

/**
 * Soft delete user by ID
 * @route DELETE /api/users/:id
 * @access Admin only
 */
export const deleteUser = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    logger.info(LOG_ACTIONS.DELETING);

    // Call service method which handles all business logic
    const success = await userService.deleteUser(id);

    if (!success) {
      const { status: errorStatus, response } =
        errorHandler.handleNotFoundError(MODULES.USER, MODULES.USER);
      throwCustomErrorWithStatus(response, errorStatus);
    }

    // Return HTTP response
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(successResponse(USER_MESSAGES.DELETED_SUCCESSFULLY, null));
  } catch (error) {
    // Handle HTTP error response
    const { status: errorStatus, response } = errorHandler.handleError(
      error,
      MODULES.USER,
      OPERATIONS.DELETE
    );
    return res.status(errorStatus).json(errorResponse(response));
  }
};

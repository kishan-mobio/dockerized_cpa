import axios from "axios";
import { createLogger } from "../utils/logger.utils.js";
import { LOGGER_NAMES } from "../utils/constants/log.constants.js";

const logger = createLogger(LOGGER_NAMES.USER_SERVICE);

// User service base URL from config
// Use Docker service name for container-to-container communication
const USER_SERVICE_BASE_URL =
  process.env.USER_SERVICE_URL || "http://user-service:3003/api/users";

/**
 * Get user by ID from user service
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data or null
 */
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_BASE_URL}/${userId}`);
    return response.data.data;
  } catch (error) {
    logger.error("Error fetching user by ID from user service:", {
      error: error.message,
      userId,
    });
    return null;
  }
};

/**
 * Get user by email from user service
 * @param {string} email - User email
 * @returns {Promise<Object>} User data or null
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${USER_SERVICE_BASE_URL}/email/${email}`);
    return response.data.data;
  } catch (error) {
    logger.error("Error fetching user by email from user service:", {
      error: error.message,
      email,
    });
    return null;
  }
};

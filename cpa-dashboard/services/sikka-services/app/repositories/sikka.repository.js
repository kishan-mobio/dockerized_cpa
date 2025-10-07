import { RequestKey } from "../models/index.model.js";
import {
  create,
  findOne,
  update,
  findById,
  exists,
} from "../utils/database.util.js";

export const sikkaRepository = {
  /**
   * Create a new Sikka request key record
   * @param {Object} params - { request_key, start_time, end_time, expires_in, office_id }
   * @returns {Promise<Object>} Created record
   */
  createRequestKey: async (params) => {
    return await create(RequestKey, params);
  },

  /**
   * Find Sikka request key record by query
   * @param {Object} where - Where conditions
   * @returns {Promise<Object|null>} Found record or null
   */
  findRequestKey: async (where) => {
    return await findOne(RequestKey, { where });
  },

  /**
   * Find Sikka request key record by ID
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} Found record or null
   */
  findRequestKeyById: async (id) => {
    return await findById(RequestKey, id);
  },

  /**
   * Update Sikka request key record
   * @param {string} id - Record ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated record or null
   */
  updateRequestKey: async (id, updateData) => {
    return await update(RequestKey, id, updateData);
  },

  /**
   * Check if request key exists
   * @param {number} id - Record ID
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  requestKeyExists: async (id) => {
    return await exists(RequestKey, id);
  },
};

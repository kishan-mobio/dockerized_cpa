// DATABASE UTILITIES - Centralized Database Operations

import { createLogger } from "./logger.util.js";
import { LOGGER_NAMES, PAGINATION } from "./constants.util.js";

const logger = createLogger(LOGGER_NAMES.DB_UTILS);

/**
 * Create a new record
 * @param {Object} model - Sequelize model
 * @param {Object} data - Data to create
 * @returns {Promise<Object>} Created record
 */
export const create = async (model, data) => {
  const record = await model.create(data);
  logger.info(`${model.name} created successfully with ID: ${record.id}`);
  return record;
};

/**
 * Find all records with optional query conditions
 * @param {Object} model - Sequelize model
 * @param {Object} query - Query options (where, include, order, etc.)
 * @returns {Promise<Array>} Array of records
 */
export const findAll = async (model, query = {}) => {
  const getALLQuery = {
    ...query,
    where: { is_deleted: false },
    order: [["created_at", "ASC"]],
  };
  const records = await model.findAll(getALLQuery);
  logger.info(`Found ${records.length} ${model.name} records`);
  return records;
};

/**
 * Find a record by ID with optional query conditions
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @param {Object} query - Additional query options
 * @returns {Promise<Object|null>} Found record or null
 */
export const findById = async (model, id, query = {}) => {
  const record = await model.findOne({
    ...query,
    where: {
      id,
      is_deleted: false,
    },
  });
  if (record) {
    logger.info(`${model.name} found with ID: ${id}`);
  } else {
    logger.warn(`${model.name} not found with ID: ${id}`);
  }
  return record;
};

/**
 * Update a record by ID
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @param {Object} data - Data to update
 * @returns {Promise<Object|null>} Updated record or null
 */
export const update = async (model, id, data) => {
  const existingRecord = await model.findOne({
    where: { id, is_deleted: false },
  });
  if (!existingRecord) {
    logger.warn(`${model.name} not found or already deleted with ID: ${id}`);
    return null;
  }

  await model.update(data, {
    where: { id, is_deleted: false },
  });

  const updatedRecord = await model.findOne({
    where: { id },
  });

  logger.info(`${model.name} updated successfully with ID: ${id}`);
  return updatedRecord;
};

/**
 * Soft delete a record by setting is_deleted flag
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} Success status
 */
export const softDelete = async (model, id) => {
  const existingRecord = await model.findOne({
    where: { id, is_deleted: false },
  });

  if (!existingRecord) {
    logger.warn(`${model.name} not found or already deleted with ID: ${id}`);
    return false;
  }
  const [_affectedRows] = await model.update(
    { is_deleted: true },
    { where: { id, is_deleted: false } }
  );


  logger.info(`${model.name} soft deleted successfully with ID: ${id}`);
  return true;
};

/**
 * Hard delete a record permanently
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} Success status
 */
export const destroy = async (model, id) => {
  const existingRecord = await model.findOne({
    where: { id, is_deleted: false },
  });

  if (!existingRecord) {
    logger.warn(`${model.name} not found or already deleted with ID: ${id}`);
    return false;
  }

  await model.destroy({
    where: { id, is_deleted: false },
  });

  logger.info(`${model.name} hard deleted successfully with ID: ${id}`);
  return true;
};

/**
 * Check if a record exists by ID
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
export const exists = async (model, id) => {
  const record = await model.findOne({
    where: { id, is_deleted: false },
    attributes: ["id"],
  });
  return !!record;
};

/**
 * Find one record with query conditions
 * @param {Object} model - Sequelize model
 * @param {Object} query - Query options
 * @returns {Promise<Object|null>} Found record or null
 */
export const findOne = async (model, query = {}) => {
  const record = await model.findOne({
    ...query,
    where: { is_deleted: false, ...(query.where || {}) },
  });
  return record;
};

/**
 * Count records with optional conditions
 * @param {Object} model - Sequelize model
 * @param {Object} where - Where conditions
 * @returns {Promise<number>} Count of records
 */
export const count = async (model, where = {}) => {
  const countResult = await model.count({
    where: { is_deleted: false, ...where },
  });
  return countResult;
};

/**
 * Find and count records with pagination
 * @param {Object} model - Sequelize model
 * @param {Object} query - Query options including pagination
 * @returns {Promise<Object>} Records with count
 */
export const findAndCountAll = async (model, query = {}) => {
  const result = await model.findAndCountAll({
    ...query,
    where: { is_deleted: false, ...(query.where || {}) },
  });
  return result;
};

/**
 * Paginate records with standard pagination
 * @param {Object} model - Sequelize model
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Paginated result
 */
export const paginate = async (model, options = {}) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    include = [],
    order = [["created_at", "ASC"]],
    attributes,
    where = {},
  } = options;

  const offset = (page - 1) * limit;
  const queryOptions = {
    include,
    order,
    attributes,
    limit: parseInt(limit),
    offset: parseInt(offset),
    where: { is_deleted: false, ...where },
  };
  const { rows, count } = await model.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Bulk create records
 * @param {Object} model - Sequelize model
 * @param {Array} data - Array of data objects
 * @param {Object} options - Bulk create options
 * @returns {Promise<Array>} Created records
 */
export const bulkCreate = async (model, data, options = {}) => {
  const records = await model.bulkCreate(data, {
    ...options,
    returning: true,
  });
  logger.info(`Bulk created ${records.length} ${model.name} records`);
  return records;
};

/**
 * Bulk update records
 * @param {Object} model - Sequelize model
 * @param {Array} data - Array of data objects
 * @param {Object} options - Bulk update options
 * @returns {Promise<Array>} Updated records
 */
export const bulkUpdate = async (model, data, options = {}) => {
  const records = await model.bulkCreate(data, {
    ...options,
    updateOnDuplicate: Object.keys(data[0] || {}),
    returning: true,
  });
  logger.info(`Bulk updated ${records.length} ${model.name} records`);
  return records;
};

/**
 * Create include configuration for Sequelize associations
 * @param {Object} model - Sequelize model
 * @param {string} as - Association alias
 * @returns {Object} Include configuration
 */
export const getIncludeConfig = (model, as) => {
  return {
    model,
    as,
    required: false,
  };
};

export default {
  create,
  findAll,
  findById,
  update,
  softDelete,
  destroy,
  exists,
  findOne,
  count,
  findAndCountAll,
  paginate,
  bulkCreate,
  bulkUpdate,
  getIncludeConfig,
};

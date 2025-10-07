// DATABASE UTILITIES - Centralized Database Operations

import { createLogger } from "./logger.util.js";
import { LOGGER_NAMES, PAGINATION } from "./constants.util.js";
import Sequelize from "sequelize";

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
      ...query.where,
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
 * Find a single record with query conditions
 * @param {Object} model - Sequelize model
 * @param {Object} query - Query options
 * @returns {Promise<Object|null>} Found record or null
 */
export const findOne = async (model, query = {}) => {
  const record = await model.findOne({
    ...query,
    where: {
      is_deleted: false,
      ...query.where,
    },
  });
  if (record) {
    logger.info(`${model.name} found`);
  } else {
    logger.warn(`${model.name} not found with given conditions`);
  }
  return record;
};

/**
 * Update a record by ID
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @param {Object} data - Data to update
 * @param {Object} options - Additional options
 * @returns {Promise<Object|null>} Updated record or null
 */
export const update = async (model, id, data, options = {}) => {
  const [updatedRowsCount] = await model.update(data, {
    where: {
      id,
      is_deleted: false,
    },
    ...options,
  });

  if (updatedRowsCount === 0) {
    logger.warn(`${model.name} not found or not updated with ID: ${id}`);
    return null;
  }

  const updatedRecord = await findById(model, id);
  logger.info(`${model.name} updated successfully with ID: ${id}`);
  return updatedRecord;
};

/**
 * Soft delete a record by ID
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} Success status
 */
export const softDelete = async (model, id, options = {}) => {
  const [updatedRowsCount] = await model.update(
    { is_deleted: true },
    {
      where: {
        id,
        is_deleted: false,
      },
      ...options,
    }
  );

  if (updatedRowsCount === 0) {
    logger.warn(`${model.name} not found or already deleted with ID: ${id}`);
    return false;
  }

  logger.info(`${model.name} soft deleted successfully with ID: ${id}`);
  return true;
};

/**
 * Hard delete a record by ID
 * @param {Object} model - Sequelize model
 * @param {number} id - Record ID
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} Success status
 */
export const hardDelete = async (model, id, options = {}) => {
  const deletedRowsCount = await model.destroy({
    where: { id },
    ...options,
  });

  if (deletedRowsCount === 0) {
    logger.warn(`${model.name} not found with ID: ${id}`);
    return false;
  }

  logger.info(`${model.name} hard deleted successfully with ID: ${id}`);
  return true;
};

/**
 * Check if a record exists
 * @param {Object} model - Sequelize model
 * @param {Object} where - Where conditions
 * @returns {Promise<boolean>} Existence status
 */
export const exists = async (model, where = {}) => {
  const count = await model.count({
    where: {
      is_deleted: false,
      ...where,
    },
  });
  const recordExists = count > 0;
  logger.info(`${model.name} exists check: ${recordExists}`);
  return recordExists;
};

/**
 * Count records with optional conditions
 * @param {Object} model - Sequelize model
 * @param {Object} where - Where conditions
 * @returns {Promise<number>} Count of records
 */
export const count = async (model, where = {}) => {
  const recordCount = await model.count({
    where: {
      is_deleted: false,
      ...where,
    },
  });
  logger.info(`${model.name} count: ${recordCount}`);
  return recordCount;
};

/**
 * Paginate records with optional query conditions
 * @param {Object} model - Sequelize model
 * @param {Object} options - Pagination and query options
 * @returns {Promise<Object>} Paginated results with metadata
 */
export const paginate = async (model, options = {}) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    pageSize = PAGINATION.DEFAULT_LIMIT,
    where = {},
    include = [],
    order = [["created_at", "ASC"]],
    attributes,
  } = options;

  const limit = Math.min(pageSize, PAGINATION.MAX_LIMIT);
  const offset = (page - 1) * limit;

  const queryOptions = {
    where: {
      is_deleted: false,
      ...where,
    },
    include,
    order,
    limit,
    offset,
  };

  if (attributes) {
    queryOptions.attributes = attributes;
  }

  const { count: totalCount, rows: records } = await model.findAndCountAll(
    queryOptions
  );

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const result = {
    data: records,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };

  logger.info(
    `${model.name} paginated: page ${page}, ${records.length} records, ${totalCount} total`
  );
  return result;
};

/**
 * Bulk create records
 * @param {Object} model - Sequelize model
 * @param {Array} dataArray - Array of data objects to create
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} Created records
 */
export const bulkCreate = async (model, dataArray, options = {}) => {
  const records = await model.bulkCreate(dataArray, {
    validate: true,
    ...options,
  });
  logger.info(`${model.name} bulk created: ${records.length} records`);
  return records;
};

/**
 * Bulk update records
 * @param {Object} model - Sequelize model
 * @param {Object} data - Data to update
 * @param {Object} where - Where conditions
 * @param {Object} options - Additional options
 * @returns {Promise<number>} Number of updated records
 */
export const bulkUpdate = async (model, data, where = {}, options = {}) => {
  const [updatedRowsCount] = await model.update(
    data,
    {
      where: {
        is_deleted: false,
        ...where,
      },
      ...options,
    }
  );
  logger.info(`${model.name} bulk updated: ${updatedRowsCount} records`);
  return updatedRowsCount;
};

/**
 * Bulk soft delete records
 * @param {Object} model - Sequelize model
 * @param {Object} where - Where conditions
 * @param {Object} options - Additional options
 * @returns {Promise<number>} Number of deleted records
 */
export const bulkSoftDelete = async (model, where = {}, options = {}) => {
  const [deletedRowsCount] = await model.update(
    { is_deleted: true },
    {
      where: {
        is_deleted: false,
        ...where,
      },
      ...options,
    }
  );
  logger.info(`${model.name} bulk soft deleted: ${deletedRowsCount} records`);
  return deletedRowsCount;
};

/**
 * Execute raw SQL query
 * @param {string} query - SQL query string
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Query results
 */
export const rawQuery = async (query, options = {}) => {
  const [results] = await Sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
    ...options,
  });
  logger.info(`Raw query executed: ${results.length} results`);
  return results;
};

export default {
  create,
  findAll,
  findById,
  findOne,
  update,
  softDelete,
  hardDelete,
  exists,
  count,
  paginate,
  bulkCreate,
  bulkUpdate,
  bulkSoftDelete,
  rawQuery,
};

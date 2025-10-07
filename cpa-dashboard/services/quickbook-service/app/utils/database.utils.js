import { createLogger } from './logger.utils.js';
import { DATABASE_REPOSITORY_LOGS } from './constants/messages.constants.js';

const logger = createLogger('DATABASE_UTILS');

/**
 * Create a new record
 * @param {Object} Model - Sequelize model
 * @param {Object} data - Data to create
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Created record
 */
export const create = async (Model, data, options = {}) => {
  try {
    const record = await Model.create(data, options);
    logger.info(DATABASE_REPOSITORY_LOGS.RECORD_CREATED(Model.name, record.id));
    return record;
  } catch (error) {
    logger.error(`database.utils.js:create - ${DATABASE_REPOSITORY_LOGS.CREATE_ERROR(Model.name, error.message)}`);
    throw error;
  }
};

/**
 * Find record by ID
 * @param {Object} Model - Sequelize model
 * @param {number|string} id - Record ID
 * @param {Object} options - Additional options
 * @returns {Promise<Object|null>} Found record or null
 */
export const findById = async (Model, id, options = {}) => {
  try {
    const record = await Model.findByPk(id, options);
    if (record) {
      logger.debug(DATABASE_REPOSITORY_LOGS.RECORD_FOUND(Model.name, id));
    } else {
      logger.debug(DATABASE_REPOSITORY_LOGS.RECORD_NOT_FOUND(Model.name, id));
    }
    return record;
  } catch (error) {
    logger.error(`database.utils.js:findById - ${DATABASE_REPOSITORY_LOGS.FIND_ERROR(Model.name, id, error.message)}`);
    throw error;
  }
};

/**
 * Find one record with conditions
 * @param {Object} Model - Sequelize model
 * @param {Object} where - Where conditions
 * @param {Object} options - Additional options
 * @returns {Promise<Object|null>} Found record or null
 */
export const findOne = async (Model, where, options = {}) => {
  try {
    const record = await Model.findOne({ where, ...options });
    if (record) {
      logger.debug(DATABASE_REPOSITORY_LOGS.RECORD_FOUND(Model.name, 'by conditions'));
    } else {
      logger.debug(DATABASE_REPOSITORY_LOGS.RECORD_NOT_FOUND(Model.name, 'by conditions'));
    }
    return record;
  } catch (error) {
    logger.error(`database.utils.js:findOne - ${DATABASE_REPOSITORY_LOGS.FIND_ERROR(Model.name, 'by conditions', error.message)}`);
    throw error;
  }
};

/**
 * Update record by ID
 * @param {Object} Model - Sequelize model
 * @param {number|string} id - Record ID
 * @param {Object} data - Data to update
 * @param {Object} options - Additional options
 * @returns {Promise<Object|null>} Updated record or null
 */
export const update = async (Model, id, data, options = {}) => {
  try {
    const [affectedRows] = await Model.update(data, { where: { id }, ...options });
    if (affectedRows > 0) {
      const updatedRecord = await Model.findByPk(id, options);
      logger.info(DATABASE_REPOSITORY_LOGS.RECORD_UPDATED(Model.name, id));
      return updatedRecord;
    } else {
      logger.warn(DATABASE_REPOSITORY_LOGS.NO_RECORD_TO_UPDATE(Model.name, id));
      return null;
    }
  } catch (error) {
    logger.error(`database.utils.js:update - ${DATABASE_REPOSITORY_LOGS.UPDATE_ERROR(Model.name, id, error.message)}`);
    throw error;
  }
};

/**
 * Soft delete record by ID
 * @param {Object} Model - Sequelize model
 * @param {number|string} id - Record ID
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} Success status
 */
export const softDelete = async (Model, id, options = {}) => {
  try {
    const [affectedRows] = await Model.update(
      { is_deleted: true, deleted_at: new Date() },
      { where: { id }, ...options }
    );
    if (affectedRows > 0) {
      logger.info(DATABASE_REPOSITORY_LOGS.RECORD_SOFT_DELETED(Model.name, id));
      return true;
    } else {
      logger.warn(DATABASE_REPOSITORY_LOGS.NO_RECORD_TO_DELETE(Model.name, id));
      return false;
    }
  } catch (error) {
    logger.error(`database.utils.js:softDelete - ${DATABASE_REPOSITORY_LOGS.DELETE_ERROR(Model.name, id, error.message)}`);
    throw error;
  }
};

/**
 * Find all records
 * @param {Object} Model - Sequelize model
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Found records
 */
export const findAll = async (Model, options = {}) => {
  try {
    const records = await Model.findAll(options);
    logger.debug(DATABASE_REPOSITORY_LOGS.RECORDS_FOUND(Model.name, records.length));
    return records;
  } catch (error) {
    logger.error(`database.utils.js:findAll - ${DATABASE_REPOSITORY_LOGS.FIND_ALL_ERROR(Model.name, error.message)}`);
    throw error;
  }
};

/**
 * Paginate records
 * @param {Object} Model - Sequelize model
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Paginated result
 */
export const paginate = async (Model, options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      offset = (page - 1) * limit,
      ...queryOptions
    } = options;

    const { count, rows } = await Model.findAndCountAll({
      ...queryOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    logger.debug(DATABASE_REPOSITORY_LOGS.RECORDS_PAGINATED(Model.name, page, limit, count));

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    logger.error(`database.utils.js:paginate - ${DATABASE_REPOSITORY_LOGS.PAGINATION_ERROR(Model.name, error.message)}`);
    throw error;
  }
};

/**
 * Check if record exists
 * @param {Object} Model - Sequelize model
 * @param {number|string} id - Record ID
 * @param {Object} options - Additional options
 * @returns {Promise<boolean>} Exists status
 */
export const exists = async (Model, id, options = {}) => {
  try {
    const count = await Model.count({ where: { id }, ...options });
    const exists = count > 0;
    logger.debug(DATABASE_REPOSITORY_LOGS.RECORD_EXISTS_CHECK(Model.name, id, exists));
    return exists;
  } catch (error) {
    logger.error(`database.utils.js:exists - ${DATABASE_REPOSITORY_LOGS.EXISTS_CHECK_ERROR(Model.name, id, error.message)}`);
    throw error;
  }
};

/**
 * Count records
 * @param {Object} Model - Sequelize model
 * @param {Object} whereConditions - Where conditions
 * @param {Object} options - Additional options
 * @returns {Promise<number>} Count of records
 */
export const count = async (Model, whereConditions = {}, options = {}) => {
  try {
    const count = await Model.count({
      where: whereConditions,
      ...options,
    });
    logger.debug(DATABASE_REPOSITORY_LOGS.RECORDS_COUNTED(Model.name, count));
    return count;
  } catch (error) {
    logger.error(`database.utils.js:count - ${DATABASE_REPOSITORY_LOGS.COUNT_ERROR(Model.name, error.message)}`);
    throw error;
  }
};

export default {
  create,
  findById,
  findOne,
  update,
  softDelete,
  findAll,
  paginate,
  exists,
  count,
};

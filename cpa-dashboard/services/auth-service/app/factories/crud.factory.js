// CRUD FACTORY - Centralized CRUD Operations with Validation

import { createLogger } from '../utils/logger.utils.js';
import { LOGGER_NAMES } from '../utils/constants/log.constants.js';
import { HARDCODED_STRINGS } from '../utils/constants/strings.constants.js';
import {
  create,
  findAll,
  findOne,
  update,
  destroy,
  exists,
  count,
  findAndCountAll,
} from '../utils/database.utils.js';


const logger = createLogger(LOGGER_NAMES.CRUD_FACTORY);

/**
 * CRUD Factory providing standardized CRUD operations with validation
 */
export const crudFactory = {
  /**
   * Check if a duplicate record exists
   * @param {Object} model - Sequelize model to check
   * @param {Object} whereClause - Conditions to check
   * @param {string} fieldName - Name of the field being checked (for logging)
   * @returns {Promise<boolean>} True if duplicate exists, false otherwise
   */
  async checkDuplicate(model, whereClause, fieldName = HARDCODED_STRINGS.DEFAULT_FIELD_NAME) {
    logger.info(
      VALIDATION_LOG.DUPLICATE_CHECK(
        model.name,
        fieldName,
        JSON.stringify(whereClause)
      )
    );

    const existingRecord = await findOne(model, {
      where: whereClause,
      attributes: [HARDCODED_STRINGS.DB_FIELDS.ID],
    });

    if (existingRecord) {
      logger.warn(
        VALIDATION_LOG.DUPLICATE_FOUND(
          model.name,
          fieldName,
          JSON.stringify(whereClause)
        )
      );
      return true;
    }

    logger.info(
      VALIDATION_LOG.DUPLICATE_NOT_FOUND(
        model.name,
        fieldName,
        JSON.stringify(whereClause)
      )
    );
    return false;
  },

  /**
   * Validate that a foreign key reference exists
   * @param {Object} model - Sequelize model to check against
   * @param {number} id - ID to validate
   * @param {string} fieldName - Name of the foreign key field
   * @returns {Promise<boolean>} True if valid, false otherwise
   */
  async validateForeignKey(model, id, fieldName) {
    if (!id) {
      return true; // Allow null/undefined for optional foreign keys
    }

    logger.info(
      VALIDATION_LOG.FOREIGN_KEY_CHECK(model.name, id, fieldName)
    );

    const existsResult = await exists(model, id);

    if (existsResult) {
      logger.info(
        VALIDATION_LOG.FOREIGN_KEY_VALID(model.name, id, fieldName)
      );
      return true;
    } else {
      logger.warn(
        VALIDATION_LOG.FOREIGN_KEY_INVALID(model.name, id, fieldName)
      );
      return false;
    }
  },

  /**
   * Handle record creation with validation
   * @param {Object} model - Sequelize model
   * @param {Object} data - Data to create
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Created record
   */
  async handleCreate(model, data, _options = {}) {
    logger.info(CRUD_LOG.OPERATION_START('create', model.name));

    const record = await create(model, data);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('create', model.name, record.id)
    );
    return record;
  },

  /**
   * Handle record update with validation
   * @param {Object} model - Sequelize model
   * @param {number} id - Record ID to update
   * @param {Object} data - Data to update
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Updated record
   */
  async handleUpdate(model, id, data, options = {}) {
    logger.info(CRUD_LOG.OPERATION_START('update', model.name));

    const record = await update(model, id, data, options);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('update', model.name, id)
    );
    return record;
  },

  /**
   * Handle record deletion with validation
   * @param {Object} model - Sequelize model
   * @param {number} id - Record ID to delete
   * @param {Object} options - Additional options
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  async handleDelete(model, id, options = {}) {
    logger.info(CRUD_LOG.OPERATION_START('delete', model.name));

    const result = await destroy(model, id, options);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('delete', model.name, id)
    );
    return result;
  },

  /**
   * Handle record retrieval with pagination
   * @param {Object} model - Sequelize model
   * @param {Object} options - Query options including pagination
   * @returns {Promise<Object>} Records with pagination info
   */
  async handleGetAll(model, options = {}) {
    const { page = HARDCODED_STRINGS.DEFAULT_PAGE, limit = HARDCODED_STRINGS.DEFAULT_LIMIT, ...queryOptions } = options;

    logger.info(
      CRUD_LOG.OPERATION_START('get', model.name)
    );

    const result = await findAndCountAll(model, {
      ...queryOptions,
      limit: parseInt(limit),
      offset: (parseInt(page) - HARDCODED_STRINGS.DEFAULT_PAGE) * parseInt(limit),
    });

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('get', model.name)
    );

    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.count,
        totalPages: Math.ceil(result.count / parseInt(limit)),
      },
    };
  },

  /**
   * Handle single record retrieval
   * @param {Object} model - Sequelize model
   * @param {number} id - Record ID to retrieve
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Retrieved record
   */
  async handleGetById(model, id, options = {}) {
    logger.info(
      CRUD_LOG.OPERATION_START('get by id', model.name)
    );

    const record = await findOne(model, { where: { [HARDCODED_STRINGS.DB_FIELDS.ID]: id }, ...options });

    if (!record) {
      logger.warn(
        CRUD_LOG.OPERATION_FAILED('get by id', model.name, HARDCODED_STRINGS.SERVICE_MESSAGES.RECORD_NOT_FOUND)
      );
      return null;
    }

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('get by id', model.name, id)
    );
    return record;
  },

  /**
   * Handle bulk operations
   * @param {Object} model - Sequelize model
   * @param {Array} data - Array of data for bulk operation
   * @param {string} operation - Operation type ('create', 'update', 'delete')
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Results of bulk operation
   */
  async handleBulkOperation(model, data, operation, options = {}) {
    logger.info(
      CRUD_LOG.BULK_OPERATION_START(operation, model.name, data.length)
    );

    let result;
    switch (operation) {
      case 'create':
        result = await model.bulkCreate(data, options);
        break;
      case 'update':
        result = await model.bulkCreate(data, {
          ...options,
          updateOnDuplicate: Object.keys(data[0] || {}),
        });
        break;
      case 'delete':
        const ids = data.map(item => item[HARDCODED_STRINGS.DB_FIELDS.ID] || item);
        result = await destroy(model, ids, options);
        break;
      default:
        throw new Error(`${HARDCODED_STRINGS.SERVICE_MESSAGES.UNSUPPORTED_BULK_OPERATION}: ${operation}`);
    }

    logger.info(
      CRUD_LOG.BULK_OPERATION_SUCCESS(operation, model.name, data.length)
    );
    return result;
  },

  /**
   * Handle record count with conditions
   * @param {Object} model - Sequelize model
   * @param {Object} whereClause - Conditions to count
   * @returns {Promise<number>} Count of records
   */
  async handleCount(model, whereClause = {}) {
    logger.info(
      CRUD_LOG.OPERATION_START('count', model.name)
    );

    const result = await count(model, whereClause);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('count', model.name)
    );
    return result;
  },

  /**
   * Handle record existence check
   * @param {Object} model - Sequelize model
   * @param {number} id - Record ID to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async handleExists(model, id) {
    logger.info(
      CRUD_LOG.OPERATION_START('exists check', model.name)
    );

    const result = await exists(model, id);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('exists check', model.name, id)
    );
    return result;
  },

  /**
   * Handle custom query execution
   * @param {Object} model - Sequelize model
   * @param {Object} queryOptions - Query options
   * @returns {Promise<Array>} Query results
   */
  async handleCustomQuery(model, queryOptions) {
    logger.info(
      CRUD_LOG.OPERATION_START('custom query', model.name)
    );

    const result = await findAll(model, queryOptions);

    logger.info(
      CRUD_LOG.OPERATION_SUCCESS('custom query', model.name)
    );
    return result;
  },
};

export default crudFactory;

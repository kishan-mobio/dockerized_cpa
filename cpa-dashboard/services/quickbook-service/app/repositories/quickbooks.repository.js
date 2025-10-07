import { GLAccountMaster, sequelize } from '../models/index.js';
import { 
  create, 
  findById, 
  findOne, 
  update, 
  softDelete, 
  findAll, 
  paginate, 
  exists, 
  count 
} from '../utils/database.utils.js';
import { QUICKBOOKS_FIELD_NAMES, QUICKBOOKS_SEQUELIZE_OPERATORS } from '../utils/constants/config.constants.js';
import { QUICKBOOKS_REPOSITORY_LOGS } from '../utils/constants/log.constants.js';
import { QUICKBOOKS_COMMON_MESSAGES } from '../utils/constants/error.constants.js';
import logger from '../../config/logger.config.js';

export const quickbooksRepository = {

  async create(accountData) {
    try {
      return await create(GLAccountMaster, accountData);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.CREATE_ERROR, {
        error: error.message,
        stack: error.stack,
        accountData: accountData
      });
      throw error;
    }
  },

  async findMany(filter = {}) {
    try {
      return await findAll(GLAccountMaster, { where: filter });
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_MANY_ERROR, {
        error: error.message,
        stack: error.stack,
        filter: filter
      });
      throw error;
    }
  },

  async findById(id, options = {}) {
    try {
      return await findById(GLAccountMaster, id, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_BY_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        id: id,
        options: options
      });
      throw error;
    }
  },

  async findByRealmId(realmId, options = {}) {
    try {
      return await findOne(GLAccountMaster, { where: { realm_id: realmId } }, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_BY_REALM_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        realmId: realmId,
        options: options
      });
      throw error;
    }
  },

  async findByOrganizationId(organizationId, options = {}) {
    try {
      return await findAll(GLAccountMaster, {
        where: { organization_id: organizationId },
        ...options
      });
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_BY_ORGANIZATION_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        organizationId: organizationId,
        options: options
      });
      throw error;
    }
  },

  async findOne(where, options = {}) {
    try {
      return await findOne(GLAccountMaster, { where }, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_ONE_ERROR, {
        error: error.message,
        stack: error.stack,
        where: where,
        options: options
      });
      throw error;
    }
  },

  async updateById(id, updateData, options = {}) {
    try {
      return await update(GLAccountMaster, id, updateData, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.UPDATE_BY_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        id: id,
        updateData: updateData,
        options: options
      });
      throw error;
    }
  },

  async updateByRealmId(realmId, updateData, options = {}) {
    try {
      return await update(GLAccountMaster, { realm_id: realmId }, updateData, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.UPDATE_BY_REALM_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        realmId: realmId,
        updateData: updateData,
        options: options
      });
      throw error;
    }
  },

  async softDeleteById(id, options = {}) {
    try {
      return await softDelete(GLAccountMaster, id, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.SOFT_DELETE_BY_ID_ERROR, {
        error: error.message,
        stack: error.stack,
        id: id,
        options: options
      });
      throw error;
    }
  },

  async findPaginated(options = {}) {
    try {
      return await paginate(GLAccountMaster, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_PAGINATED_ERROR, {
        error: error.message,
        stack: error.stack,
        options: options
      });
      throw error;
    }
  },

  async exists(id, options = {}) {
    try {
      return await exists(GLAccountMaster, id, options);
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.EXISTS_ERROR, {
        error: error.message,
        stack: error.stack,
        id: id,
        options: options
      });
      throw error;
    }
  },

  async realmIdExists(realmId, excludeId = null) {
    try {
      const where = { 
        [QUICKBOOKS_FIELD_NAMES.REALM_ID]: realmId,
        [QUICKBOOKS_FIELD_NAMES.IS_DELETED]: false 
      };
      
      if (excludeId) {
        where.id = { [require('sequelize').Op[QUICKBOOKS_SEQUELIZE_OPERATORS.NE]]: excludeId };
      }
      
      const account = await findOne(GLAccountMaster, { where });
      return !!account;
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.REALM_ID_EXISTS_ERROR, {
        error: error.message,
        stack: error.stack,
        realmId: realmId,
        excludeId: excludeId
      });
      throw error;
    }
  },

  async count(whereConditions = {}, options = {}) {
    try {
      return await count(GLAccountMaster, { where: whereConditions, ...options });
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.COUNT_ERROR, {
        error: error.message,
        stack: error.stack,
        whereConditions: whereConditions,
        options: options
      });
      throw error;
    }
  },

  async findActive(options = {}) {
    try {
      return await findAll(GLAccountMaster, {
        where: { 
          status: true, 
          is_deleted: false 
        },
        ...options
      });
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_ACTIVE_ERROR, {
        error: error.message,
        stack: error.stack,
        options: options
      });
      throw error;
    }
  },

  async findByStatus(status, options = {}) {
    try {
      return await findAll(GLAccountMaster, {
        where: { 
          status: status, 
          is_deleted: false 
        },
        ...options
      });
    } catch (error) {
      logger.error(QUICKBOOKS_REPOSITORY_LOGS.FIND_BY_STATUS_ERROR, {
        error: error.message,
        stack: error.stack,
        status: status,
        options: options
      });
      throw error;
    }
  },

  async findWithUserInfo(whereConditions = {}, options = {}) {
    return await findAll(GLAccountMaster, {
      where: whereConditions,
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['fullName'],
          required: false
        }
      ],
      attributes: {
        include: [
          [sequelize.literal('user.fullName'), 'user_name']
        ]
      },
      ...options
    });
  },

  async findByOrganizationWithUserInfo(organizationId, options = {}) {
    return await this.findWithUserInfo({ organization_id: organizationId }, options);
  },

  async updateLastSynced(id, lastSynced = new Date(), options = {}) {
    return await this.updateById(id, { 
      last_synced: lastSynced,
      updated_at: new Date()
    }, options);
  },

  async updateTokens(id, tokenData, options = {}) {
    return await this.updateById(id, {
      ...tokenData,
      updated_at: new Date()
    }, options);
  },

  async updateStatus(id, status, options = {}) {
    return await this.updateById(id, {
      status: status,
      updated_at: new Date()
    }, options);
  },

  async restore(id, options = {}) {
    return await update(GLAccountMaster, id, { 
      is_deleted: false, 
      deleted_at: null 
    }, options);
  },

  async hardDelete(id, options = {}) {
    try {
      await GLAccountMaster.destroy({
        where: { id },
        force: true,
        ...options
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

};

export default quickbooksRepository;

import { QuickbookAccount } from "../models/index.js";
import { create } from "../utils/database.utils.js";



/**
 * Store account info into quickbook_accounts model using db utils
 * @param {object} sequelize - Sequelize instance
 * @param {object} accountData - Account data to upsert
 * @returns {Promise<boolean>} Success status
 */
export const accountsRepository = {
  /**
   * Store account info into quickbook_accounts model
   * @param {Object} accountData - Account data to store
   * @returns {Promise<Object>} Created account
   */
  async storeAccountInfo(accountData) {
    return await create(QuickbookAccount, accountData);
  },
};

export default accountsRepository;

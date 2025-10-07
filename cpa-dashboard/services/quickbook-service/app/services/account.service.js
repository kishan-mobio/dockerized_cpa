import logger from "../../config/logger.config.js";
import accountsRepository from "../repositories/account.repository.js";
import { LOG_DATABASE } from "../utils/constants/log.constants.js";
import { getApiCall, getMappedAccounts } from "../utils/methods.util.js";

/**
 * Fetches account info from QuickBooks API and stores in DB
 * @param {string} url - QuickBooks API URL
 * @param {string} token - QuickBooks API token
 * @returns {Promise<object>} - Object containing stored account IDs
 */
export const fetchAndStoreAccountInfo = async (url, token) => {
  const response = await getApiCall(url, token);
  const accounts = response.data?.QueryResponse.Account || [];

  if (!Array.isArray(accounts) || accounts.length === 0) {
    logger.warn(LOG_DATABASE.NO_ACCOUNTS_FOUND);
    return { stored: [] };
  }

  const mappedAccounts = getMappedAccounts(accounts);

  await Promise.all(
    mappedAccounts.map((account) =>
      accountsRepository.storeAccountInfo(account)
    )
  );

  return { stored: mappedAccounts.map((acc) => acc.id) };
};

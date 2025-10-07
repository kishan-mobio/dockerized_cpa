import axios from "axios";

/**
 * Make a GET request to the specified URL with the provided token
 * @param {string} url - URL to make request to
 * @param {string} token - Token to use for authentication
 * @returns {Promise<Object>} - Response data
 */
export const getApiCall = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};


/**
 * Get QuickBooks API query for the specified table
 * @param {string} tableName - Name of the table
 * @returns {string} API query string
 */
export const getQuickbookApiQuery = (tableName) =>
  `/query?query=select * from ${tableName}`;


/**
 * Map QuickBooks account data to local schema
 * @param {Array} accounts - Array of QuickBooks account objects
 * @returns {Array} Array of mapped account objects
 */
export const getMappedAccounts = (accounts) =>
  accounts.map((acc) => ({
    id: acc.Id,
    name: acc.Name,
    sub_account: acc.SubAccount,
    fully_qualified_name: acc.FullyQualifiedName,
    active: acc.Active,
    classification: acc.Classification,
    account_type: acc.AccountType,
    account_sub_type: acc.AccountSubType,
    current_balance: acc.CurrentBalance,
    current_balance_with_sub_accounts: acc.CurrentBalanceWithSubAccounts,
    currency_value: acc.CurrencyRef?.value,
    currency_name: acc.CurrencyRef?.name,
    domain: acc.domain,
    sparse: acc.sparse,
    sync_token: acc.SyncToken,
    create_time: acc.MetaData?.CreateTime,
    last_updated_time: acc.MetaData?.LastUpdatedTime,
  }));
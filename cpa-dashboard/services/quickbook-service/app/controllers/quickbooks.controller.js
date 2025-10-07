import {
  QUICKBOOKS_CONTROLLER_LOGS,
  QUICKBOOKS_ERROR_LOGS,
  QUICKBOOKS_SUCCESS_LOGS,
} from "../utils/constants/log.constants.js";
import {
  QUICKBOOKS_DEFAULTS,
  QUICKBOOKS_STATUS,
  QUICKBOOKS_FIELD_NAMES,
  QUICKBOOKS_VALIDATION,
  QUICKBOOKS_LOGGER_NAMES,
} from "../utils/constants/config.constants.js";
import { QUICKBOOKS_MESSAGES } from "../utils/constants/error.constants.js";
import { HARDCODED_STRINGS } from "../utils/constants/strings.constants.js";
import * as status from "../utils/status_code.utils.js";
import {
  errorResponse,
  successResponse,
} from "../utils/response.util.js";
import { createLogger } from "../utils/logger.utils.js";
import { encrypt } from "../utils/encryption.utils.js";
import quickbooksService from "../services/quickbooks.service.js";
import quickbooksRepository from "../repositories/quickbooks.repository.js";

const logger = createLogger(QUICKBOOKS_LOGGER_NAMES.QUICKBOOKS_CONTROLLER);

// Environment Configuration - Centralized and validated
const QB_CONFIG = {
  clientID: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  tokenUrl: process.env.QUICKBOOKS_TOKEN_URL,
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
};

// Validation helper for environment variables
const validateEnvironmentConfig = () => {
  const missingVars = Object.entries(QB_CONFIG)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`${HARDCODED_STRINGS.MISSING_ENV_VARS}: ${missingVars.join(", ")}`);
  }
};

// Initialize and validate configuration
try {
  validateEnvironmentConfig();
} catch (error) {
  logger.error(QUICKBOOKS_CONTROLLER_LOGS.CONFIG_ERROR, {
    error: error.message,
  });
}

/**
 * Validates required fields for API requests
 * @param {Object} data - Request data
 * @param {Array} requiredFields - Array of required field names
 * @returns {Array} Array of missing fields
 */
const validateRequiredFields = (data, requiredFields) => {
  try {
    return requiredFields.filter((field) => !data[field]);
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.VALIDATE_REQUIRED_FIELDS_ERROR, {
      error: error.message,
      stack: error.stack,
      data: data,
      requiredFields: requiredFields
    });
    throw error;
  }
};

const handleDatabaseError = (error) => {
  try {
    const errorMappings = {
      [QUICKBOOKS_DEFAULTS.SQL_ERROR_FOREIGN_KEY]: {
        status: status.STATUS_CODE_BAD_REQUEST,
        message: QUICKBOOKS_MESSAGES.FOREIGN_KEY_VIOLATION_ERROR,
      },
      [QUICKBOOKS_DEFAULTS.SQL_ERROR_DUPLICATE]: {
        status: status.STATUS_CODE_BAD_REQUEST,
        message: QUICKBOOKS_MESSAGES.DUPLICATE_QUICKBOOK_ACCOUNT_ERROR,
      },
      [QUICKBOOKS_DEFAULTS.POSTGRES_UNIQUE_VIOLATION]: {
        status: status.STATUS_CODE_CONFLICT,
        message: QUICKBOOKS_MESSAGES.DUPLICATE_QUICKBOOK_ACCOUNT_ERROR,
      },
    };

    return (
      errorMappings[error.number] ||
      errorMappings[error.original?.code] || {
        status: status.STATUS_CODE_INTERNAL_SERVER_ERROR,
        message: error.message || QUICKBOOKS_MESSAGES.INTERNAL_SERVER_ERROR,
      }
    );
  } catch (err) {
    logger.error(QUICKBOOKS_ERROR_LOGS.HANDLE_DATABASE_ERROR_ERROR, {
      error: err.message,
      stack: err.stack,
      originalError: error
    });
    return {
      status: status.STATUS_CODE_INTERNAL_SERVER_ERROR,
      message: QUICKBOOKS_MESSAGES.INTERNAL_SERVER_ERROR,
    };
  }
};


/**
 * Generic error response handler
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @returns {Object} HTTP response
 */
const sendErrorResponse = (
  res,
  error,
  _defaultMessage = QUICKBOOKS_MESSAGES.INTERNAL_SERVER_ERROR
) => {
  try {
    logger.error(QUICKBOOKS_ERROR_LOGS.CONTROLLER_ERROR, {
      error: error.message,
      stack: error.stack,
    });
    const errorInfo = handleDatabaseError(error);
    return res.status(errorInfo.status).json(errorResponse(errorInfo.message));
  } catch (err) {
    logger.error(QUICKBOOKS_ERROR_LOGS.SEND_ERROR_RESPONSE_ERROR, {
      error: err.message,
      stack: err.stack,
      originalError: error
    });
    return res.status(status.STATUS_CODE_INTERNAL_SERVER_ERROR).json(
      errorResponse(QUICKBOOKS_MESSAGES.INTERNAL_SERVER_ERROR)
    );
  }
};




export const addQuickbookAccount = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.ADDING_ACCOUNT);

  try {
    const { code, realmId, email, company_name, organization_id } = req.query;

    // Validate required fields using helper
    const missingFields = validateRequiredFields(
      { code, organization_id },
      QUICKBOOKS_VALIDATION.REQUIRED_FIELDS.ADD_ACCOUNT
    );

    if (missingFields.length > 0) {
      const missingField = missingFields[0];
      const errorMessage =
        missingField === HARDCODED_STRINGS.CODE
          ? QUICKBOOKS_MESSAGES.AUTHORIZATION_CODE_NOT_FOUND
          : QUICKBOOKS_MESSAGES.ORGANIZATION_ID_REQUIRED;

      return res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(errorResponse(errorMessage));
    }

    // Exchange authorization code for access token
    const tokenData = await quickbooksService.exchangeAuthCodeForTokens(code);
    const { access_token, refresh_token } = tokenData;

    // Encrypt tokens securely
    const [encryptedAccessToken, encryptedRefreshToken] = await Promise.all([
      encrypt(access_token),
      encrypt(refresh_token),
    ]);

    // Check for existing account to prevent duplicates
    const existingAccount = await quickbooksRepository.findByRealmId(realmId);

    const accountData = {
      [QUICKBOOKS_FIELD_NAMES.ACCESS_TOKEN]: encryptedAccessToken,
      [QUICKBOOKS_FIELD_NAMES.REFRESH_TOKEN]: encryptedRefreshToken,
      [QUICKBOOKS_FIELD_NAMES.COMPANY_NAME]: company_name,
      [QUICKBOOKS_FIELD_NAMES.EMAIL]: email,
      [QUICKBOOKS_FIELD_NAMES.UPDATED_AT]: new Date(),
    };

    if (existingAccount) {
      // Validate organization ownership
      if (existingAccount.organization_id !== parseInt(organization_id)) {
        return res
          .status(status.STATUS_CODE_FORBIDDEN)
          .json(
            errorResponse(QUICKBOOKS_MESSAGES.QUICKBOOKS_ACCOUNT_ALREADY_EXISTS)
          );
      }

      await quickbooksRepository.updateById(existingAccount.id, accountData);
    } else {
      // Create new account
      await quickbooksRepository.create({
        ...accountData,
        [QUICKBOOKS_FIELD_NAMES.ORGANIZATION_ID]: organization_id,
        [QUICKBOOKS_FIELD_NAMES.REALM_ID]: realmId,
      });
    }

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(successResponse(QUICKBOOKS_MESSAGES.ACCOUNT_AUTHORIZED));
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_ADDING_ACCOUNT, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Retrieves QuickBooks accounts with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const listQuickbookAccounts = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.GETTING_ACCOUNTS);

  try {
    const { active, organization_id } = req.query;

    // Build filter conditions using helper function
    const buildWhereClause = () => {
      const whereClause = {};

      if (organization_id) {
        whereClause[QUICKBOOKS_FIELD_NAMES.ORGANIZATION_ID] =
          parseInt(organization_id);
      } else if (req.user?.organization_id) {
        whereClause[QUICKBOOKS_FIELD_NAMES.ORGANIZATION_ID] =
          req.user.organization_id;
      } else if (req.user?.id) {
        whereClause[QUICKBOOKS_FIELD_NAMES.USER_ID] = req.user.id;
      }

      if (active !== undefined) {
        whereClause[QUICKBOOKS_FIELD_NAMES.STATUS] = active === HARDCODED_STRINGS.BOOLEAN.TRUE;
      }

      return whereClause;
    };

    const whereClause = buildWhereClause();
    const accounts = await quickbooksRepository.findWithUserInfo(whereClause);

    logger.info(QUICKBOOKS_CONTROLLER_LOGS.FOUND_ACCOUNTS(accounts.length));

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(
        successResponse(QUICKBOOKS_MESSAGES.ACCOUNTS_FETCHED_SUCCESSFULLY, {
          accounts,
        })
      );
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_GETTING_ACCOUNTS, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Adds or updates QuickBooks tokens for an account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const addTokens = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.ADDING_TOKEN);

  try {
    const { id, refresh_token, access_token } = req.body;

    // Validate required fields
    const missingFields = validateRequiredFields(
      { id, refresh_token, access_token },
      QUICKBOOKS_VALIDATION.REQUIRED_FIELDS.ADD_TOKEN
    );

    if (missingFields.length > 0) {
      return res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(errorResponse(QUICKBOOKS_MESSAGES.TOKENS_REQUIRED));
    }

    // Check if account exists
    const accountExists = await quickbooksRepository.exists(id);
    if (!accountExists) {
      return res
        .status(status.STATUS_CODE_NOT_FOUND)
        .json(errorResponse(QUICKBOOKS_MESSAGES.ACCOUNT_NOT_FOUND));
    }

    // Encrypt and update tokens
    const [encryptedRefreshToken, encryptedAccessToken] = await Promise.all([
      encrypt(refresh_token),
      encrypt(access_token),
    ]);

    const tokenData = {
      [QUICKBOOKS_FIELD_NAMES.REFRESH_TOKEN]: encryptedRefreshToken,
      [QUICKBOOKS_FIELD_NAMES.ACCESS_TOKEN]: encryptedAccessToken,
      [QUICKBOOKS_FIELD_NAMES.TOKEN_EXPIRY_TIME]: new Date(
        Date.now() + QUICKBOOKS_DEFAULTS.TOKEN_EXPIRY_MS
      ),
    };

    const updatedAccount = await quickbooksRepository.updateTokens(
      id,
      tokenData
    );

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(
        successResponse(QUICKBOOKS_MESSAGES.TOKEN_ADDED_SUCCESSFULLY, {
          account: updatedAccount,
        })
      );
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_ADDING_TOKEN, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Refreshes QuickBooks access tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const getTokens = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.GETTING_TOKENS);

  try {
    const { id } = req.body;

    // Validate required fields
    const missingFields = validateRequiredFields(
      { id },
      QUICKBOOKS_VALIDATION.REQUIRED_FIELDS.GET_TOKENS
    );
    if (missingFields.length > 0) {
      return res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(errorResponse(QUICKBOOKS_MESSAGES.ACCOUNT_ID_REQUIRED));
    }

    // Find account
    const quickbookAccount = await quickbooksRepository.findById(id);
    if (!quickbookAccount) {
      return res
        .status(status.STATUS_CODE_NOT_FOUND)
        .json(errorResponse(QUICKBOOKS_MESSAGES.ACCOUNT_NOT_FOUND));
    }

    // Refresh tokens using service
    const updatedAccount = await quickbooksService.refreshTokens(
      quickbookAccount
    );
    if (!updatedAccount) {
      return res
        .status(status.STATUS_CODE_INTERNAL_SERVER_ERROR)
        .json(errorResponse(QUICKBOOKS_MESSAGES.FAILED_TO_REFRESH_TOKENS));
    }

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(successResponse(QUICKBOOKS_MESSAGES.NEW_TOKEN_GENERATED));
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_ADDING_TOKEN, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Syncs QuickBooks data with local storage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const quickbooksFileSave = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.ADDING_FILE);

  const initiatedBy = req.body.isCronJob
    ? QUICKBOOKS_STATUS.AUTOMATIC
    : req.user?.email || HARDCODED_STRINGS.UNKNOWN_USER;

  try {
    const { organization_id, id, isCronJob } = req.body;

    // Handle sync all accounts scenario
    if (!organization_id || !id) {
      return await syncAllQuickBooksAccounts();
    }

    // Validate required fields for single account sync
    const missingFields = validateRequiredFields(
      { organization_id, id },
      QUICKBOOKS_VALIDATION.REQUIRED_FIELDS.SYNC_DATA
    );

    if (missingFields.length > 0) {
      await quickbooksService.logQuickBookSync(
        initiatedBy,
        QUICKBOOKS_STATUS.FAILED
      );
      return res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(errorResponse(HARDCODED_STRINGS.ORGANIZATION_ID_AND_ACCOUNT_ID_REQUIRED));
    }

    // Find account
    const quickbookAccount = await quickbooksRepository.findById(id);
    if (!quickbookAccount) {
      await quickbooksService.logQuickBookSync(
        initiatedBy,
        QUICKBOOKS_STATUS.FAILED
      );
      return res
        .status(status.STATUS_CODE_NOT_FOUND)
        .json(errorResponse(QUICKBOOKS_MESSAGES.ACCOUNT_NOT_FOUND));
    }

    // Sync data using service
    const syncResult = await quickbooksService.syncAccountData(
      quickbookAccount,
      organization_id,
      initiatedBy
    );

    // Update last synced timestamp
    await quickbooksRepository.updateLastSynced(id);

    if (!isCronJob) {
      await quickbooksService.logQuickBookSync(
        initiatedBy,
        QUICKBOOKS_STATUS.COMPLETED
      );
    }

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(
        successResponse(QUICKBOOKS_MESSAGES.DATA_SYNCED_SUCCESSFULLY, {
          uploadedFiles: syncResult,
        })
      );
  } catch (error) {
    await quickbooksService.logQuickBookSync(
      initiatedBy,
      QUICKBOOKS_STATUS.FAILED
    );
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_UPLOADING_FILE, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Updates QuickBooks account status (enable/disable)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} HTTP response
 */
export const statusDisable = async (req, res) => {
  logger.info(QUICKBOOKS_SUCCESS_LOGS.DISABLING_ACCOUNT);

  try {
    const { accountStatus } = req.body;
    const { id } = req.params;

    // Find account
    const quickbookAccount = await quickbooksRepository.findById(id);
    if (!quickbookAccount) {
      return res
        .status(status.STATUS_CODE_NOT_FOUND)
        .json(errorResponse(QUICKBOOKS_MESSAGES.ACCOUNT_NOT_FOUND));
    }

    // Update status
    const updatedAccount = await quickbooksRepository.updateStatus(
      id,
      accountStatus
    );

    // Determine success message
    const message = accountStatus
      ? QUICKBOOKS_MESSAGES.ACCOUNT_ENABLED_SUCCESSFULLY
      : QUICKBOOKS_MESSAGES.ACCOUNT_DISABLED_SUCCESSFULLY;

    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(successResponse(message, { quickbookAccount: updatedAccount }));
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.ERROR_DISABLING_ACCOUNT, {
      error: error.message,
    });
    return sendErrorResponse(res, error);
  }
};



/**
 * Syncs all QuickBooks accounts across all organizations
 * @returns {Promise<void>} Completion status
 */
export const syncAllQuickBooksAccounts = async () => {
  try {
    // Note: Organization model not available, would iterate through organizations
    const organizations = []; // await quickbooksRepository.getAllOrganizations();

    for (const org of organizations) {
      try {
        const quickbookAccounts = await quickbooksRepository.findByOrganizationId(
          org.id
        );

        const syncPromises = quickbookAccounts.map(async (account) => {
          try {
            return await quickbooksService.syncAccountData(
              account,
              org.id,
              QUICKBOOKS_STATUS.AUTOMATIC
            );
          } catch (error) {
            logger.error(QUICKBOOKS_ERROR_LOGS.SYNC_ACCOUNT_DATA_ERROR, {
              error: error.message,
              stack: error.stack,
              accountId: account.id,
              organizationId: org.id
            });
            throw error;
          }
        });

        await Promise.allSettled(syncPromises);
      } catch (error) {
        logger.error(QUICKBOOKS_ERROR_LOGS.PROCESS_ORGANIZATION_ERROR, {
          error: error.message,
          stack: error.stack,
          organizationId: org.id
        });
        throw error;
      }
    }
  } catch (error) {
    logger.error(QUICKBOOKS_ERROR_LOGS.SYNC_ALL_ACCOUNTS_ERROR, {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Export all controller functions
export default {
  addQuickbookAccount,
  listQuickbookAccounts,
  addTokens,
  getTokens,
  quickbooksFileSave,
  statusDisable,
  syncAllQuickBooksAccounts,
};

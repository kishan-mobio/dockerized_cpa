import * as status from "../utils/status_code.utils.js";
import { errorResponse, successResponse } from "../utils/response.util.js";
import { fetchAndStoreAccountInfo } from "../services/account.service.js";
import logger from "../../config/logger.config.js";
import { getQuickbookApiQuery } from "../utils/methods.util.js";
import { HARDCODED_STRINGS } from "../utils/constants/strings.constants.js";



const quickbook_url = process.env.QUICKBOOKS_API_URL;

/**
 * API Controller: Fetches account info from QuickBooks API and stores in DB
 * @route POST /api/quickbooks/accounts/fetch
 * @body { token: string }
 */
export const fetchAndStoreQuickbookAccount = async (req, res) => {
  try {
    logger.info(HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.FETCH_AND_STORE_STARTED);
    const { token } = req.body;
    if (!token) {
      return res
        .status(status.STATUS_CODE_BAD_REQUEST)
        .json(errorResponse(HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.TOKEN_REQUIRED));
    };
    
    if (!quickbook_url){
      throw new Error(HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.API_URL_NOT_CONFIGURED);
    };
    const url = `${quickbook_url}${getQuickbookApiQuery(QUICKBOOK_TABLE_NAMES.ACCOUNT)}`;
    
    const result = await fetchAndStoreAccountInfo(url, token);
    logger.info(HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.FETCH_AND_STORE_SUCCESS);
    return res
      .status(status.STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.FETCH_AND_STORE_SUCCESS,
          result
        )
      );
  } catch (error) {
    logger.error(HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.ERROR_MESSAGE, error.message);
    return res
      .status(status.STATUS_CODE_INTERNAL_SERVER_STATUS)
      .json(
        errorResponse(error.message || HARDCODED_STRINGS.QUICKBOOK_ACCOUNT_MESSAGES.ERROR_MESSAGE)
      );
  }
};
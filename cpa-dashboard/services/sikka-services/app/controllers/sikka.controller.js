import { createLogger } from "../utils/logger.util.js";
import {
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_SUCCESS,
} from "../utils/status_code.util.js";
import {
  LOGGER_NAMES,
  LOG_ACTIONS,
  CONTROLLER_MESSAGES,
} from "../utils/constants.util.js";
import * as sikkaService from "../services/sikka.service.js";
import { errorResponse, successResponse } from "../utils/response.util.js";

const logger = createLogger(LOGGER_NAMES.SIKKA_CONTROLLER);

/**
 * Generate Request key from Sikka
 * @route POST /api/sikka/request-key
 * @access Public
 */
export const requestKey = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.REQUESTING_KEY);
    const { office_id } = req.body;

    const requestKeyRecord = await sikkaService.generateRequestKey(office_id);

    logger.info(LOG_ACTIONS.REQUEST_KEY_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.REQUEST_KEY_GENERATED,
          requestKeyRecord
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.REQUEST_KEY_FAILED, { error: error.message });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

import {
  SIKKA_API,
  SIKKA_MESSAGES,
  LOG_ACTIONS,
  ERROR_MESSAGES,
  MODEL_FIELDS,
  METHOD_TYPES,
} from "../utils/constants.util.js";
import {
  sikkaApiCall,
  createSikkaHeaders,
  validateAndThrowIfInvalid,
  findPracticeByOfficeId,
  validateAndGetPracticeCredentials,
  createRequestKeyPayload,
  formatRequestKeyResponse,
} from "../utils/methods.util.js";
import { createLogger } from "../utils/logger.util.js";
import { sikkaRepository } from "../repositories/sikka.repository.js";

const logger = createLogger("sikka-service");
const app_id = process.env.SIKKA_APP_ID;
const app_key = process.env.SIKKA_APP_KEY;

/**
 * Generate and store a new request key
 * This method encapsulates the complete business logic for request key generation
 * @param {string} office_id - Office ID
 * @returns {Object} Created request key record
 */
export const generateRequestKey = async (office_id) => {
  logger.info(LOG_ACTIONS.REQUESTING_KEY);

  // Validate credentials
  validateAndThrowIfInvalid(app_id, app_key);

  // Get authorized practices
  const practicesData = await getAuthorizedPractices(app_id, app_key);
  if (!practicesData.data || practicesData.data.items.length === 0) {
    throw new Error(SIKKA_MESSAGES.NO_AUTHORIZED_PRACTICES);
  }

  // Find and validate practice
  const practice = findPracticeByOfficeId(practicesData.data.items, office_id);
  if (!practice) {
    throw new Error(SIKKA_MESSAGES.NO_AUTHORIZED_PRACTICES);
  }
  const secret_key = validateAndGetPracticeCredentials(practice);

  // Create request key payload and call API
  const requestKeyPayload = createRequestKeyPayload({
    office_id,
    secret_key,
    app_id,
    app_key,
  });
  const requestKeyData = await callRequestKeyAPI(requestKeyPayload);
  const formattedData = formatRequestKeyResponse(requestKeyData);
  const requestKeyRecord = await storeRequestKey(formattedData);

  logger.info(LOG_ACTIONS.REQUEST_KEY_SUCCESS, {
    [MODEL_FIELDS.OFFICE_ID]: office_id,
  });

  return requestKeyRecord;
};

/**
 * Get authorized practices from Sikka API
 * @param {string} app_id - Application ID
 * @param {string} app_key - Application Key
 * @returns {Object} Response with practices data
 */
export const getAuthorizedPractices = async (app_id, app_key) => {
  const headers = createSikkaHeaders(app_id, app_key);

  return await sikkaApiCall(
    METHOD_TYPES.GET,
    SIKKA_API.ENDPOINTS.AUTHORIZED_PRACTICES,
    {
      headers,
      logContext: { [MODEL_FIELDS.APP_ID]: app_id },
      successMessage: LOG_ACTIONS.PRACTICES_FETCHED,
      errorMessage: ERROR_MESSAGES.API_CALL_FAILED_FOR,
    }
  ).then((data) => ({
    message: SIKKA_MESSAGES.AUTHORIZED_PRACTICES_SUCCESS,
    data,
  }));
};

/**
 * Call Sikka request key API
 * @param {Object} requestData - Request payload
 * @returns {Object} Response with request key data
 */
export const callRequestKeyAPI = (requestData) => {
  return sikkaApiCall(METHOD_TYPES.POST, SIKKA_API.ENDPOINTS.REQUEST_KEY, {
    data: requestData,
    successMessage: LOG_ACTIONS.REQUEST_KEY_SUCCESS,
    errorMessage: ERROR_MESSAGES.REQUEST_KEY_API_FAILED,
  });
};

/**
 * Store Sikka request key data in the database
 * @param {Object} params - { request_key, start_time, end_time, expires_in }
 * @returns {Promise<Object>} Created record
 */
export const storeRequestKey = async (params) => {
  const existingRecord = await sikkaRepository.findRequestKey({
    office_id: params.office_id,
  });
  if (existingRecord) {
    return await sikkaRepository.updateRequestKey(existingRecord.id, params);
  } else {
    return await sikkaRepository.createRequestKey(params);
  }
};

/**
 * Get request key from database
 * @param {string} office_id - Office ID
 * @returns {Object} Request key data
 */
export const getRequestKey = async (office_id) => {
  const requestKeyRecord = await sikkaRepository.findRequestKey({ office_id });

  return (
    (requestKeyRecord && {
      request_key: requestKeyRecord.get(MODEL_FIELDS.REQUEST_KEY),
      end_time: requestKeyRecord.get(MODEL_FIELDS.END_TIME),
    }) ||
    {}
  );
};

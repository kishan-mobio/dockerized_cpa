import axios from "axios";
import {
  LOG_ACTIONS,
  SIKKA_API,
  VALIDATION_RULES,
  LOGGER_NAMES,
  SIKKA_MESSAGES,
  BUSINESS_CONSTANTS,
  HTTP_HEADERS,
  ERROR_MESSAGES,
  MODEL_FIELDS,
  NUMERIC_CONSTANTS,
  SIKKA_CONSTANTS,
  HTTP_HEADER_CONSTANTS,
  METHOD_TYPES,
  VALIDATION_MESSAGES,
} from "./constants.util.js";

import { createLogger } from "../utils/logger.util.js";
import {
  generateRequestKey,
  getRequestKey,
} from "../services/sikka.service.js";

const logger = createLogger(LOGGER_NAMES.SIKKA_SERVICE);

/**
 * Common method to make a Sikka API call with logging and error handling
 * @param {string} method - HTTP method ('get', 'post', etc.)
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Optional parameters
 * @param {Object} [options.headers] - Additional headers
 * @param {Object} [options.data] - Request payload for POST/PUT
 * @param {Object} [options.logContext] - Additional context for logging
 * @param {string} [options.successMessage] - Message for successful operation
 * @param {string} [options.errorMessage] - Error message if API call fails
 * @param {Function} [options.validateResponse] - Custom response validation function
 * @returns {Object} API response data
 */
export async function sikkaApiCall(
  method,
  endpoint,
  {
    headers = null,
    data = null,
    logContext = {},
    successMessage,
    errorMessage,
  } = {}
) {
  logger.info(`Calling ${method.toUpperCase()} ${endpoint}`, logContext);

  const apiUrl = formatSikkaApiUrl(endpoint);
  const config = getConfig(method, apiUrl, headers, data);
  const response = await axiosRequestWithLogging(config, logger);

  if (response.status !== BUSINESS_CONSTANTS.HTTP_SUCCESS_STATUS) {
    throw new Error(
      errorMessage || `${SIKKA_MESSAGES.API_CALL_FAILED}: ${response.status}`
    );
  }

  logger.info(
    successMessage || `${method.toUpperCase()} ${endpoint} successful`,
    {
      ...logContext,
      status: response.status,
    }
  );
  return response.data;
}

/**
 * Format response data for request key
 * @param {Object} requestKeyData - Response from request key API
 * @returns {Object} Formatted response data
 */
export const formatRequestKeyResponse = (requestKeyData) => {
  const { request_key, issued_to, start_time, end_time, expires_in } =
    requestKeyData;
  return {
    request_key,
    office_id: issued_to,
    start_time,
    end_time,
    expires_in: parseInt(expires_in, NUMERIC_CONSTANTS.RADIX_DECIMAL),
  };
};

/**
 * Generic function to make an axios request with error handling
 * @param {Object} config - Axios request config
 * @param {Object} logger - Logger instance
 * @param {string} [office_id] - Optional office_id for logging
 * @returns {Object} Axios response
 */
export async function axiosRequestWithLogging(config, logger) {
  try {
    return await axios(config);
  } catch (error) {
    logger.error(LOG_ACTIONS.REQUEST_KEY_API_FAILED, {
      error: error.message,
    });
    if (error.response) {
      throw new Error(
        `${SIKKA_MESSAGES.SIKKA_API_ERROR}: ${error.response.status} - ${
          error.response.data?.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      throw new Error(SIKKA_MESSAGES.NETWORK_ERROR_OCCURRED);
    } else {
      throw error;
    }
  }
}

export const getConfig = (method, url, headers = null, data = null) => {
  const defaultHeaders = {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
  };
  return {
    method,
    url,
    headers: headers || defaultHeaders,
    data: data || {},
  };
};

/**
 * Validate Sikka credentials
 * @param {string} app_id - App ID to validate
 * @param {string} app_key - App Key to validate
 * @returns {Object} Validation result
 */
export const validateSikkaCredentials = (app_id, app_key) => {
  const errors = [];

  // Validate app_id
  if (!app_id || typeof app_id !== BUSINESS_CONSTANTS.STRING_TYPE) {
    errors.push(ERROR_MESSAGES.APP_ID_REQUIRED_STRING);
  } else if (
    app_id.length < VALIDATION_RULES.APP_ID_MIN_LENGTH ||
    app_id.length > VALIDATION_RULES.APP_ID_MAX_LENGTH
  ) {
    errors.push(
      `App ID must be between ${VALIDATION_RULES.APP_ID_MIN_LENGTH} and ${VALIDATION_RULES.APP_ID_MAX_LENGTH} characters`
    );
  }

  // Validate app_key
  if (!app_key || typeof app_key !== BUSINESS_CONSTANTS.STRING_TYPE) {
    errors.push(ERROR_MESSAGES.APP_KEY_REQUIRED_STRING);
  } else if (
    app_key.length < VALIDATION_RULES.APP_KEY_MIN_LENGTH ||
    app_key.length > VALIDATION_RULES.APP_KEY_MAX_LENGTH
  ) {
    errors.push(
      `App Key must be between ${VALIDATION_RULES.APP_KEY_MIN_LENGTH} and ${VALIDATION_RULES.APP_KEY_MAX_LENGTH} characters`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format Sikka API URL
 * @param {string} endpoint - API endpoint
 * @returns {string} Complete API URL
 */
export const formatSikkaApiUrl = (endpoint) => {
  return `${SIKKA_API.BASE_URL}/${SIKKA_API.VERSION}${endpoint}`;
};

/**
 * Find practice by email from practices data
 * @param {Array} practicesItems - Array of practice items
 * @param {string} office_id - Office ID to search for
 * @returns {Object|undefined} Found practice or undefined
 */
export const findPracticeByOfficeId = (practicesItems, office_id) => {
  return practicesItems.find(
    (item) => item[MODEL_FIELDS.OFFICE_ID] === office_id
  );
};

/**
 * Validate practice credentials
 * @param {Object} practice - Practice object
 * @returns {Object} Validation result with secret_key
 */
export const validateAndGetPracticeCredentials = (practice) => {
  const secret_key = practice?.[MODEL_FIELDS.SECRET_KEY];

  if (!secret_key) {
    throw new Error(SIKKA_MESSAGES.MISSING_PRACTICE_CREDENTIALS);
  }

  return secret_key;
};

/**
 * Create request key payload
 * @param {Object} params - Parameters for payload
 * @param {string} params.office_id - Office ID
 * @param {string} params.secret_key - Secret key
 * @param {string} params.app_id - App ID
 * @param {string} params.app_key - App key
 * @returns {Object} Request key payload
 */
export const createRequestKeyPayload = ({
  office_id,
  secret_key,
  app_id,
  app_key,
}) => {
  return {
    [MODEL_FIELDS.GRANT_TYPE]: SIKKA_API.GRANT_TYPES.REQUEST_KEY,
    [MODEL_FIELDS.OFFICE_ID]: office_id,
    [MODEL_FIELDS.SECRET_KEY]: secret_key,
    [MODEL_FIELDS.APP_ID]: app_id,
    [MODEL_FIELDS.APP_KEY]: app_key,
  };
};

/**
 * Create headers for Sikka API calls
 * @param {string} app_id - App ID
 * @param {string} app_key - App key
 * @returns {Object} Headers object
 */
export const createSikkaHeaders = (app_id, app_key) => {
  return {
    [HTTP_HEADERS.APP_ID]: app_id,
    [HTTP_HEADERS.APP_KEY]: app_key,
  };
};

/**
 * Validate credentials and throw error if invalid
 * @param {string} app_id - App ID
 * @param {string} app_key - App key
 * @throws {Error} If credentials are invalid
 */
export const validateAndThrowIfInvalid = (app_id, app_key) => {
  const validation = validateSikkaCredentials(app_id, app_key);
  if (!validation.isValid) {
    throw new Error(
      `${SIKKA_MESSAGES.INVALID_CREDENTIALS}: ${validation.errors.join(
        BUSINESS_CONSTANTS.CREDENTIAL_SEPARATOR
      )}`
    );
  }
};

export const getKpiUrl = (kpi, practice_id, start_date, end_date) => {
  const params = new URLSearchParams({ practice_id });

  if (start_date && end_date) {
    params.append("startdate", start_date);
    params.append("enddate", end_date);
  }

  return `/kpis/${kpi}?${params.toString()}`;
};

/**
 * Unified KPI fetch and store method that handles request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date (optional for some KPIs)
 * @param {string} end_date - End date (optional for some KPIs)
 * @param {string} endpoint - Sikka API endpoint
 * @param {Function} repositoryFunction - Repository function to store data
 * @param {Function} getRequestKey - Function to get request key
 * @param {Function} generateRequestKey - Function to generate new request key
 * @param {string} successLogAction - Success log action
 * @param {string} failLogAction - Fail log action
 * @param {Object} logger - Logger instance
 * @returns {Promise<Array>} Array of stored records
 */
export const fetchAndStoreKpi = async (
  office_id,
  start_date,
  end_date,
  endpoint,
  repositoryFunction,
  successLogAction,
  failLogAction,
  logger
) => {
  try {
    logger.info(successLogAction);

    // Get current request key
    let { request_key, end_time } = await getRequestKey(office_id);

    if (!request_key || end_time < new Date()) {
      logger.info(SIKKA_CONSTANTS.REQUEST_KEY_EXPIRED_MESSAGE);
      const newKeyRecord = await generateRequestKey(office_id);
      request_key = newKeyRecord.get(MODEL_FIELDS.REQUEST_KEY);
    }

    // Create headers for API call
    const headers = {
      [HTTP_HEADER_CONSTANTS.REQUEST_KEY_HEADER]: request_key,
    };

    // Fetch data from Sikka API
    const response = await sikkaApiCall(
      METHOD_TYPES.GET,
      getKpiUrl(
        endpoint,
        NUMERIC_CONSTANTS.PRACTICE_ID_DEFAULT,
        start_date,
        end_date
      ),
      {
        headers,
        successMessage: successLogAction,
        errorMessage: failLogAction,
      }
    );

    if (response.items && response.items.length > 0) {
      // Store all data in bulk using the provided repository function
      const storedData = await repositoryFunction(response.items);
      logger.info(`Successfully stored ${storedData.length} records`);
      return storedData;
    } else {
      logger.info(SIKKA_MESSAGES.NO_DATA_RECEIVED);
      return [];
    }
  } catch (error) {
    logger.error(failLogAction, { error: error.message });
    throw error;
  }
};

/**
 * Validate data for bulkCreate
 * Filters out invalid entries like null, undefined, non-objects
 * Optionally checks for required fields
 *
 * @param {Array} data - Array of data objects
 * @param {Array<string>} requiredFields - Fields that must be present in each object
 * @returns {Object} - { validData: Array, invalidData: Array }
 */
export const validateBulkCreateData = (data, requiredFields = []) => {
  if (!Array.isArray(data)) {
    throw new Error(VALIDATION_MESSAGES.DATA_MUST_BE_ARRAY);
  }

  const validData = [];
  const invalidData = [];

  for (const item of data) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      invalidData.push({ item, reason: VALIDATION_MESSAGES.INVALID_OBJECT });
      continue;
    }

    let missingFields = requiredFields.filter((field) => !(field in item));
    if (missingFields.length > 0) {
      invalidData.push({
        item,
        reason: `Missing required fields: ${missingFields.join(", ")}`,
      });
      continue;
    }

    validData.push(item);
  }

  return { validData, invalidData };
};

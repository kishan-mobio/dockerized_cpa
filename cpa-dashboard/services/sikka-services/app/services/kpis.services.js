import {
  LOG_ACTIONS,
  LOGGER_NAMES,
  SIKKA_API,
} from "../utils/constants.util.js";
import { createLogger } from "../utils/logger.util.js";
import { fetchAndStoreKpi } from "../utils/methods.util.js";
import { generateRequestKey, getRequestKey } from "./sikka.service.js";
import { kpiRepository } from "../repositories/kpi.repository.js";

const logger = createLogger(LOGGER_NAMES.KPIS_SERVICE);

/**
 * Fetch account receivables with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @returns {Promise<Array>} Array of stored account receivables
 */
export const fetchAccountReceivables = async (office_id) => {
  return await fetchAndStoreKpi(
    office_id,
    null, // start_date not used for account receivables
    null, // end_date not used for account receivables
    SIKKA_API.ENDPOINTS.ACCOUNT_RECEIVABLES,
    kpiRepository.createAccountReceivable,
    LOG_ACTIONS.ACCOUNT_RECEIVABLES_SUCCESS,
    LOG_ACTIONS.ACCOUNT_RECEIVABLES_FAILED,
    logger
  );
};

/**
 * Fetch treatment analysis with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored treatment analysis
 */
export const fetchTreatmentAnalysis = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.TREATMENT_PLAN_ANALYSIS,
    kpiRepository.createTreatmentAnalysis,
    LOG_ACTIONS.TREATMENT_ANALYSIS_SUCCESS,
    LOG_ACTIONS.TREATMENT_ANALYSIS_FAILED,
    logger
  );
};

/**
 * Fetch treatment analysis with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored treatment analysis
 */
export const directRestorations = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.DIRECT_RESTORATIONS,
    kpiRepository.directRestorations,
    LOG_ACTIONS.DIRECT_RESTORATIONS_SUCCESS,
    LOG_ACTIONS.DIRECT_RESTORATIONS_FAILED,
    logger
  );
};

/**
 * Fetch no show appointments with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored no show appointments
 */
export const fetchNoShowAppointments = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.NO_SHOW_APPOINTMENTS,
    kpiRepository.createNoShowAppointments,
    LOG_ACTIONS.NO_SHOW_APPOINTMENTS_SUCCESS,
    LOG_ACTIONS.NO_SHOW_APPOINTMENTS_FAILED,
    logger
  );
};

/**
 * Fetch avg daily production with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored avg daily production
 */
export const fetchAvgDailyProduction = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.AVG_DAILY_PRODUCTION,
    kpiRepository.createAvgDailyProduction,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED,
    logger
  );
};
/**
 * Fetch new patients with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored new patients
 */
export const fetchNewPatients = async (office_id, start_date, end_date) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.NEW_PATIENTS,
    kpiRepository.createNewPatients,
    LOG_ACTIONS.NEW_PATIENTS_SUCCESS,
    LOG_ACTIONS.NEW_PATIENTS_FAILED,
    logger
  );
};

/**
 * Fetch hygiene reappointment with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored hygiene reappointment
 */
export const fetchHygieneReappointment = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.HYGIENE_REAPPOINTMENT,
    kpiRepository.createHygieneReappointment,
    LOG_ACTIONS.HYGIENE_REAPPOINTMENT_SUCCESS,
    LOG_ACTIONS.HYGIENE_REAPPOINTMENT_FAILED,
    logger
  );
};

/**
 * Fetch total production per day with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored total production per day
 */
export const fetchTotalProductionPerDay = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.TOTAL_PRODUCTION_PER_DAY,
    kpiRepository.createTotalProductionPerDay,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED,
    logger
  );
};

/**
 * Fetch total production by dentist with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored total production by dentist
 */
export const fetchTotalProductionByDentist = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.TOTAL_PRODUCTION_BY_DENTIST,
    kpiRepository.createTotalProductionByDentist,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED,
    logger
  );
};

/**
 * Fetch total production by hygienist with automatic request key management and data storage
 * @param {string} office_id - Office ID
 * @param {string} start_date - Start date
 * @param {string} end_date - End date
 * @returns {Promise<Array>} Array of stored total production by hygienist
 */
export const fetchTotalProductionByHygienist = async (
  office_id,
  start_date,
  end_date
) => {
  return await fetchAndStoreKpi(
    office_id,
    start_date,
    end_date,
    SIKKA_API.ENDPOINTS.TOTAL_PRODUCTION_BY_HYGIENIST,
    kpiRepository.createTotalProductionByHygienist,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS,
    LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED,
    logger
  );
};

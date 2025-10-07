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
import * as kpisService from "../services/kpis.services.js";
import { errorResponse, successResponse } from "../utils/response.util.js";

const logger = createLogger(LOGGER_NAMES.KPIS_CONTROLLER);

/**
 * Get account receivables from Sikka
 * @route POST /api/sikka/account_receivables
 * @access Public
 */
export const accountReceivables = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.ACCOUNT_RECEIVABLES_SUCCESS);

    const { office_id } = req.body;
    const response = await kpisService.fetchAccountReceivables(office_id);

    logger.info(LOG_ACTIONS.ACCOUNT_RECEIVABLES_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.ACCOUNT_RECEIVABLES_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.ACCOUNT_RECEIVABLES_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get treatment analysis from Sikka
 * @route POST /api/sikka/treatment_analysis
 * @access Public
 */
export const treatmentAnalysis = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.TREATMENT_ANALYSIS_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchTreatmentAnalysis(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.TREATMENT_ANALYSIS_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.TREATMENT_ANALYSIS_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.TREATMENT_ANALYSIS_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get hygiene reappointment from Sikka
 * @route POST /api/sikka/hygiene_reappointment
 * @access Public
 */
export const hygieneReappointment = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.HYGIENE_REAPPOINTMENT_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchHygieneReappointment(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.HYGIENE_REAPPOINTMENT_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.HYGIENE_REAPPOINTMENT_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.HYGIENE_REAPPOINTMENT_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get avg daily production from Sikka
 * @route POST /api/sikka/avg_daily_production
 * @access Public
 */
export const avgDailyProduction = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchAvgDailyProduction(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.AVG_DAILY_PRODUCTION_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};
/**
 * Get new patients from Sikka
 * @route POST /api/sikka/new_patients
 * @access Public
 */
export const newPatients = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.NEW_PATIENTS_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchNewPatients(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.NEW_PATIENTS_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(CONTROLLER_MESSAGES.NEW_PATIENTS_FETCHED, response)
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.NEW_PATIENTS_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};
/**
 * Get no show appointments from Sikka
 * @route POST /api/sikka/no_show_appointments
 * @access Public
 */
export const noShowAppointments = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.NO_SHOW_APPOINTMENTS_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchNoShowAppointments(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.NO_SHOW_APPOINTMENTS_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.NO_SHOW_APPOINTMENTS_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.NO_SHOW_APPOINTMENTS_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get treatment analysis from Sikka
 * @route POST /api/sikka/treatment_analysis
 * @access Public
 */
export const directRestorations = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.DIRECT_RESTORATIONS_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.directRestorations(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.DIRECT_RESTORATIONS_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.DIRECT_RESTORATIONS_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.DIRECT_RESTORATIONS_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get total production per day from Sikka
 * @route POST /api/sikka/total_production_per_day
 * @access Public
 */
export const totalProductionPerDay = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchTotalProductionPerDay(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.AVG_DAILY_PRODUCTION_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get total production by dentist from Sikka
 * @route POST /api/sikka/total_production_by_dentist
 * @access Public
 */
export const totalProductionByDentist = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchTotalProductionByDentist(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.AVG_DAILY_PRODUCTION_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

/**
 * Get total production by hygienist from Sikka
 * @route POST /api/sikka/total_production_by_hygienist
 * @access Public
 */
export const totalProductionByHygienist = async (req, res) => {
  try {
    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);

    const { office_id, start_date, end_date } = req.body;
    const response = await kpisService.fetchTotalProductionByHygienist(
      office_id,
      start_date,
      end_date
    );

    logger.info(LOG_ACTIONS.AVG_DAILY_PRODUCTION_SUCCESS);
    return res
      .status(STATUS_CODE_SUCCESS)
      .json(
        successResponse(
          CONTROLLER_MESSAGES.AVG_DAILY_PRODUCTION_FETCHED,
          response
        )
      );
  } catch (error) {
    logger.error(LOG_ACTIONS.AVG_DAILY_PRODUCTION_FAILED, {
      error: error.message,
    });
    return res
      .status(STATUS_CODE_INTERNAL_SERVER_ERROR)
      .json(errorResponse(error.message));
  }
};

import { bulkCreate } from "../utils/database.util.js";
import {
  AccountsReceivable,
  TreatmentPlanAnalysis,
  NoShowAppointments,
  AvgDailyProduction,
  NewPatients,
  TotalProductionPerDay,
  TotalProductionByDentist,
  TotalProductionByHygienist,
  HygieneReappointment,
  DirectRestorations,
} from "../models/index.model.js";

/**
 * KPI Repository
 * @module kpiRepository
 * @description Repository for KPIs
 */
export const kpiRepository = {
  /**
   * Create a single account receivable record
   * @param {Object} data - Account receivable data
   * @returns {Promise<Object>} Created record
   */
  createAccountReceivable: async (data) => {
    return await bulkCreate(AccountsReceivable, data);
  },

  /**
   * Create treatment analysis records
   * @param {Object} data - Treatment analysis data
   * @returns {Promise<Object>} Created record
   */
  createTreatmentAnalysis: async (data) => {
    return await bulkCreate(TreatmentPlanAnalysis, data);
  },

  /**
   * Create treatment analysis records
   * @param {Object} data - Treatment analysis data
   * @returns {Promise<Object>} Created record
   */
  directRestorations: async (data) => {
    return await bulkCreate(DirectRestorations, data);
  },

  /**
   * Create avg daily production records
   * @param {Object} data - Avg daily production data
   * @returns {Promise<Object>} Created record
   */
  createAvgDailyProduction: async (data) => {
    return await bulkCreate(AvgDailyProduction, data);
  },

  /**
   * Create new patients records
   * @param {Object} data - New patients data
   * @returns {Promise<Object>} Created record
   */
  createNewPatients: async (data) => {
    return await bulkCreate(NewPatients, data);
  },

  /**
   * Create no show appointments records
   * @param {Object} data - No show appointments data
   * @returns {Promise<Object>} Created record
   */
  createNoShowAppointments: async (data) => {
    return await bulkCreate(NoShowAppointments, data);
  },

  /**
   * Create total production per day records
   * @param {Object} data - Total production per day data
   * @returns {Promise<Object>} Created record
   */
  createTotalProductionPerDay: async (data) => {
    return await bulkCreate(TotalProductionPerDay, data);
  },

  /**
   * Create total production by dentist records
   * @param {Object} data - Total production by dentist data
   * @returns {Promise<Object>} Created record
   */
  createTotalProductionByDentist: async (data) => {
    return await bulkCreate(TotalProductionByDentist, data);
  },

  /**
   * Create total production by hygienist records
   * @param {Object} data - Total production by hygienist data
   * @returns {Promise<Object>} Created record
   */
  createTotalProductionByHygienist: async (data) => {
    return await bulkCreate(TotalProductionByHygienist, data);
  },

    /**
   * Create hygiene reappointment records
   * @param {Object} data - Hygiene reappointment data
   * @returns {Promise<Object>} Created record
   */
  createHygieneReappointment: async (data) => {
    return await bulkCreate(HygieneReappointment, data);
  }
};

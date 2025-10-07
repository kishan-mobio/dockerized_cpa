import sequelize from "../../config/postgres.js";
import RequestKeyModel from "./sikka.model.js";
import AccountsReceivableModel from "./account_receivables.model.js";
import NewPatientsModel from "./new_patient.model.js";
import TreatmentPlanAnalysisModel from "./treatment_plan.model.js";
import ProductionPerDayModel from "./total_production_per_day.model.js";
import ProductionByDentistModel from "./total_production_by_dentist.js";
import ProductionByHygienistModel from "./total_production_by_hygienist.js";
import AvgDailyProductionModel from "./avg_daily_production.model.js";
import NoShowAppointmentsModel from "./no_show_appointment.model.js";
import HygieneReappointmentModel from "./hygiene_reappointment.model.js";
import DirectRestorationsModel from "./direct_restorations.model.js";


const models = {
  sikka_request_key: RequestKeyModel(sequelize),
  sikka_accounts_receivable: AccountsReceivableModel(sequelize),
  sikka_new_patients: NewPatientsModel(sequelize),
  sikka_treatment_plan_analysis: TreatmentPlanAnalysisModel(sequelize),
  sikka_total_production_per_day: ProductionPerDayModel(sequelize),
  sikka_total_production_by_dentist: ProductionByDentistModel(sequelize),
  sikka_total_production_by_hygienist: ProductionByHygienistModel(sequelize),
  sikka_avg_daily_production: AvgDailyProductionModel(sequelize),
  sikka_no_show_appointments: NoShowAppointmentsModel(sequelize),
  sikka_hygiene_reappointment: HygieneReappointmentModel(sequelize),
  sikka_direct_restoration: DirectRestorationsModel(sequelize)
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export individual models for convenience
export const {
  sikka_request_key: RequestKey,
  sikka_accounts_receivable: AccountsReceivable,
  sikka_new_patients: NewPatients,
  sikka_treatment_plan_analysis: TreatmentPlanAnalysis,
  sikka_total_production_per_day: TotalProductionPerDay,
  sikka_total_production_by_dentist: TotalProductionByDentist,
  sikka_total_production_by_hygienist: TotalProductionByHygienist,
  sikka_avg_daily_production: AvgDailyProduction,
  sikka_no_show_appointments: NoShowAppointments,
  sikka_hygiene_reappointment: HygieneReappointment,
  sikka_direct_restoration: DirectRestorations
} = models;

// Export all models and sequelize instance
export { sequelize };
export default models;

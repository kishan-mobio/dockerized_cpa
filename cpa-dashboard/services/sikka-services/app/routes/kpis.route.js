import express from "express";
import * as kpisController from "../controllers/kpis.controller.js";

const router = express.Router();

router.post("/account_receivables", kpisController.accountReceivables);
router.post("/treatment_plan_analysis", kpisController.treatmentAnalysis);
router.post("/avg_daily_production", kpisController.avgDailyProduction);
router.post("/no_show_appointments", kpisController.noShowAppointments);
router.post("/new_patients", kpisController.newPatients);
router.post("/total_production_per_day", kpisController.totalProductionPerDay);
router.post(
  "/total_production_by_dentist",
  kpisController.totalProductionByDentist
);
router.post("/direct_restorations", kpisController.directRestorations)
router.post("/hygiene_reappointment", kpisController.hygieneReappointment);
//below api currently not working due to conent response in sikka api
router.post(
  "/total_production_by_hygienist",
  kpisController.totalProductionByHygienist
);
export default router;

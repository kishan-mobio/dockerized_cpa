import express from "express";
import sikkaRoutes from "./sikka.route.js";
import kpisRoutes from "./kpis.route.js";

const router = express.Router();

// API Versions
const version1 = "/v1";

// Sikka Routes
router.use(`${version1}/sikka`, sikkaRoutes);

// KPI Routes
router.use(`${version1}/kpis`, kpisRoutes);

export default router;

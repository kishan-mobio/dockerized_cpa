import express from 'express';
import tenantRoutes from './tenant.route.js';

const router = express.Router();

// API Versions
const version1 = '/v1';

// Tenant Routes
router.use(`${version1}/tenant`, tenantRoutes);

export default router;

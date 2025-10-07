import express from 'express';
import quickbooksRoutes from './quickbooks.route.js';
import accountsRoutes from './accounts.route.js';
import reportsRoutes from './reports.route.js';

const router = express.Router();




// API version configuration
const API_VERSION = '/v1';

// Route mappings for better organization


const ROUTE_MAPPINGS = {
  quickbooks: { path: `${API_VERSION}/quickbooks`, router: quickbooksRoutes },
  reports: { path: `${API_VERSION}/reports`, router: reportsRoutes },
  accounts: { path: `${API_VERSION}/accounts`, router: accountsRoutes }
};




// Apply route mappings





Object.values(ROUTE_MAPPINGS).forEach(({ path, router: routeRouter }) => {
  router.use(path, routeRouter);
});

export default router;

import express from 'express';
import { validateJoi } from '../middleware/validation.middleware.js';
import { trialBalanceSchema, profitLossSchema, balanceSheetSchema, cashFlowSchema } from '../validators/reports.validator.js';
import * as reportController from '../controllers/reports.controller.js';

const router = express.Router();

const VALIDATION_MIDDLEWARE = {
  trialBalance: validateJoi(trialBalanceSchema),
  profitLoss: validateJoi(profitLossSchema),
  balanceSheet: validateJoi(balanceSheetSchema),
  cashFlow: validateJoi(cashFlowSchema)
};

router.post('/trial-balance', VALIDATION_MIDDLEWARE.trialBalance, reportController.fetchTrialBalance);
router.post('/profit-loss', VALIDATION_MIDDLEWARE.profitLoss, reportController.fetchProfitLoss);//done
router.post('/balance-sheet', VALIDATION_MIDDLEWARE.balanceSheet, reportController.fetchBalanceSheet); //done
router.post('/cash-flow', VALIDATION_MIDDLEWARE.cashFlow, reportController.fetchCashFlow);

router.get('/trial-balance/:realmId', reportController.getTrialBalanceReports);
router.get('/profit-loss/:realmId', reportController.getProfitLossReports);
router.get('/balance-sheet/:realmId', reportController.getBalanceSheetReports);
router.get('/cash-flow/:realmId', reportController.getCashFlowReports);

export default router;
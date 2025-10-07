import express from 'express';
import * as quickbookController from '../controllers/quickbooks.controller.js';

const router = express.Router();




// Route configuration for better maintainability

const ROUTE_CONFIG = {
  SYNC_DATA: { path: '/', method: 'POST', handler: quickbookController.quickbooksFileSave },
  
  GET_TOKENS: { path: '/token', method: 'POST', handler: quickbookController.getTokens },
  ADD_TOKENS: { path: '/add-token', method: 'POST', handler: quickbookController.addTokens },
  
  LIST_ACCOUNTS: { path: '/accounts', method: 'GET', handler: quickbookController.listQuickbookAccounts },
  ADD_ACCOUNT: { path: '/add', method: 'GET', handler: quickbookController.addQuickbookAccount },
  UPDATE_STATUS: { path: '/status/:id', method: 'PUT', handler: quickbookController.statusDisable }
};




// Apply routes using configuration

Object.values(ROUTE_CONFIG).forEach(({ path, method, handler }) => {
  router[method.toLowerCase()](path, handler);
});

export default router;
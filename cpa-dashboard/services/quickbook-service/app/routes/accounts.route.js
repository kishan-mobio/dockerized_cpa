import express from 'express';
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

// Fetch and store account info
router.post("/", accountController.fetchAndStoreQuickbookAccount);
export default router;
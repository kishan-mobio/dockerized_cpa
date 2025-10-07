import express from "express";
import * as sikkaController from "../controllers/sikka.controller.js";

const router = express.Router();

// Request API key from Sikka
router.post("/request-key", sikkaController.requestKey);

export default router;

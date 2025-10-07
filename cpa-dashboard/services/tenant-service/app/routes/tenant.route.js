import express from "express";
import * as tenantController from "../controllers/tenant.controller.js";

const router = express.Router();

// Create a new tenant
router.post("/", tenantController.createTenant);

// Get all tenants
router.get("/", tenantController.getAllTenants);

// Get tenant by ID
router.get("/:id", tenantController.getTenantById);

// Update tenant by ID
router.put("/:id", tenantController.updateTenant);

// Delete tenant by ID
router.delete("/:id", tenantController.deleteTenant);

export default router;

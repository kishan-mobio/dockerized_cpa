import express from "express";
import * as userController from "../controllers/user.controller.js";
import userValidations from "../validators/user.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Create a new user
router.post(
  "/",
  validate(userValidations.createUser),
  userController.createUser
);

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user by ID
router.put(
  "/:id",
  userController.updateUser
);

// Delete user by ID
router.delete("/:id", userController.deleteUser);

export default router;

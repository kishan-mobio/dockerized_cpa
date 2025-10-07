import express from "express";
import {
  inviteUser,
  register,
  verifyEmail,
  login,
  logout,
  setupMFA,
  verifyMFA,
  forgotPassword,
  resetPassword,
  signUp,
  getProfile,
  changePassword,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  authLimiter,
  signupLimiter,
} from "../middleware/ratelimit.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { authValidations } from "../validators/auth.validator.js";

const router = express.Router();

// AUTHENTICATION FLOW ROUTES

router.post(
  "/invite",
  verifyToken,
  authLimiter,
  validate(authValidations.inviteUser),
  inviteUser
);

router.post(
  "/register",
  signupLimiter,
  validate(authValidations.signup),
  register
);

router.post(
  "/verify-email",
  authLimiter,
  validate(authValidations.emailVerification),
  verifyEmail
);

router.post("/login", authLimiter, validate(authValidations.login), login);

router.post("/logout", verifyToken, logout);

// MULTI-FACTOR AUTHENTICATION

router.post(
  "/mfa/setup",
  verifyToken,
  validate(authValidations.mfaSetup),
  setupMFA
);

router.post(
  "/mfa/verify",
  authLimiter,
  validate(authValidations.mfaVerify),
  verifyMFA
);

// PASSWORD MANAGEMENT

router.post(
  "/forgot-password",
  authLimiter,
  validate(authValidations.forgotPassword),
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  validate(authValidations.passwordReset),
  resetPassword
);

router.post(
  "/change-password",
  verifyToken,
  authLimiter,
  validate(authValidations.changePassword),
  changePassword
);

// LEGACY / PROFILE ROUTES

router.post("/signup", signupLimiter, validate(authValidations.signup), signUp);

router.get("/profile", verifyToken, getProfile);

router.put(
  "/profile/:id",
  verifyToken,
  validate(authValidations.updateUserProfile),
  updateProfile
);

export default router;

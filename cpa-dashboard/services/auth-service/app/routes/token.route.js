import express from "express";
import {
  refreshToken,
  revokeToken,
  revokeAllTokens,
  getActiveTokens,
  validateToken,
} from "../controllers/token.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/ratelimit.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { tokenValidations } from "../validators/auth.validator.js";

const router = express.Router();


// TOKEN MANAGEMENT ROUTES


router.post(
  "/refresh",
  authLimiter,
  validate(tokenValidations.refreshToken),
  refreshToken
);

router.post(
  "/revoke",
  verifyToken,
  authLimiter,
  validate(tokenValidations.revokeToken),
  revokeToken
);

router.post("/revoke-all", verifyToken, authLimiter, revokeAllTokens);

router.get("/active", verifyToken, authLimiter, getActiveTokens);

router.post(
  "/validate",
  verifyToken,
  authLimiter,
  validate(tokenValidations.validateToken),
  validateToken
);

export default router;

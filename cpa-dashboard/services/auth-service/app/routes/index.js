import express from 'express';
import authRoutes from './auth.route.js';
import tokenRoutes from './token.route.js';

const router = express.Router();
const version1 = '/v1';


// AUTH MODULE ROUTES


/**
 * Authentication Routes
 * Handles user authentication, registration, MFA, password management
 */
router.use(`${version1}/auth`, authRoutes);

/**
 * Token Management Routes  
 * Handles token refresh, revocation, validation, and lifecycle management
 */
router.use(`${version1}/auth/token`, tokenRoutes);

export default router;
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validator';
import { authLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post(
  '/register',
  registerLimiter,
  validate(schemas.register),
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  validate(schemas.login),
  authController.login
);

// GET /api/auth/me
router.get('/me', authenticate, authController.getCurrentUser);

// PUT /api/auth/profile
router.put(
  '/profile',
  authenticate,
  validate(schemas.updateUser),
  authController.updateProfile
);

export default router;

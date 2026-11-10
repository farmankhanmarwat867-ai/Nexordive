import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  setupAdminSchema,
  updateAdminEmailSchema,
} from '../validators/authValidators.js';

const router = Router();

router.get('/status', asyncHandler(authController.getStatus));

router.post(
  '/setup',
  authRateLimiter,
  validateRequest({ body: setupAdminSchema }),
  asyncHandler(authController.setup)
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login)
);

router.post(
  '/refresh',
  authRateLimiter,
  validateRequest({ body: refreshTokenSchema }),
  asyncHandler(authController.refresh)
);

router.post('/logout', requireAuth, asyncHandler(authController.logout));
router.get('/me', requireAuth, asyncHandler(authController.getMe));

router.patch(
  '/email',
  requireAuth,
  authRateLimiter,
  validateRequest({ body: updateAdminEmailSchema }),
  asyncHandler(authController.updateEmail)
);

router.patch(
  '/password',
  requireAuth,
  authRateLimiter,
  validateRequest({ body: changePasswordSchema }),
  asyncHandler(authController.changePassword)
);

export default router;

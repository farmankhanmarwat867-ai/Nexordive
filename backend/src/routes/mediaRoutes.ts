import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { uploadImageMiddleware } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { leadIdParamSchema } from '../validators/leadValidators.js';

const router = Router();

router.get('/', requireAuth, asyncHandler(mediaController.listMedia));

router.post(
  '/upload',
  requireAuth,
  uploadImageMiddleware.single('file'),
  asyncHandler(mediaController.uploadMedia)
);

router.delete(
  '/:id',
  requireAuth,
  validateRequest({ params: leadIdParamSchema }),
  asyncHandler(mediaController.removeMedia)
);

export default router;

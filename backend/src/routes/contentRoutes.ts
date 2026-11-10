import { Router } from 'express';
import * as contentController from '../controllers/contentController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  sectionParamSchema,
  updateFullContentSchema,
  updateSectionBodySchema,
  updateSiteSettingsSchema,
} from '../validators/contentValidators.js';

const router = Router();

// Public CMS read
router.get('/', asyncHandler(contentController.getContent));

// Protected CMS management
router.put(
  '/',
  requireAuth,
  validateRequest({ body: updateFullContentSchema }),
  asyncHandler(contentController.replaceContent)
);

router.patch(
  '/sections/:section',
  requireAuth,
  validateRequest({ params: sectionParamSchema, body: updateSectionBodySchema }),
  asyncHandler(contentController.updateSection)
);

router.patch(
  '/settings',
  requireAuth,
  validateRequest({ body: updateSiteSettingsSchema }),
  asyncHandler(contentController.updateSettings)
);

router.post('/reset', requireAuth, asyncHandler(contentController.resetContent));

export default router;

import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { publicLeadRateLimiter } from '../middlewares/rateLimiter.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  createLeadSchema,
  leadIdParamSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
} from '../validators/leadValidators.js';

const router = Router();

// Public contact/estimator inquiry submission
router.post(
  '/',
  publicLeadRateLimiter,
  validateRequest({ body: createLeadSchema }),
  asyncHandler(leadController.createLead)
);

// Protected CRM routes
router.get(
  '/',
  requireAuth,
  validateRequest({ query: listLeadsQuerySchema }),
  asyncHandler(leadController.listLeads)
);

router.get(
  '/export',
  requireAuth,
  validateRequest({ query: listLeadsQuerySchema }),
  asyncHandler(leadController.exportLeadsCsv)
);

router.get(
  '/:id',
  requireAuth,
  validateRequest({ params: leadIdParamSchema }),
  asyncHandler(leadController.getLead)
);

router.patch(
  '/:id',
  requireAuth,
  validateRequest({ params: leadIdParamSchema, body: updateLeadSchema }),
  asyncHandler(leadController.updateLead)
);

router.delete(
  '/:id',
  requireAuth,
  validateRequest({ params: leadIdParamSchema }),
  asyncHandler(leadController.deleteLead)
);

export default router;

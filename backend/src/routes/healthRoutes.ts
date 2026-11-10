import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(healthController.getHealth));

export default router;

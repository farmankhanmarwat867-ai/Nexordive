import { Router } from 'express';
import authRoutes from './authRoutes.js';
import contentRoutes from './contentRoutes.js';
import healthRoutes from './healthRoutes.js';
import leadRoutes from './leadRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/content', contentRoutes);
router.use('/media', mediaRoutes);

export default router;

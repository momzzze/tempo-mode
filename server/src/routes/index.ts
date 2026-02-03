import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import authRoutes from './auth/index.js';
import sessionRoutes from './sessions/index.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/sessions', sessionRoutes);

export default router;

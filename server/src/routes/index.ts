import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import authRoutes from './auth/index.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);

export default router;

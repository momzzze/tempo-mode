import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { verifyJWT } from '../middlewares/auth.js';
import authRoutes from './auth/index.js';
import sessionRoutes from './sessions/index.js';
import taskRoutes from './tasks/index.js';

const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/sessions', verifyJWT, sessionRoutes);
router.use('/tasks', verifyJWT, taskRoutes);

export default router;

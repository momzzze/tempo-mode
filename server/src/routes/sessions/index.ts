import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.js';
import {
  createSession,
  getTodayStats,
  getWeekStats,
  getMonthStats,
  getHourlyStats,
} from '../../controllers/sessionController.js';

const router = Router();

// All routes require JWT authentication
router.use(verifyJWT);

// Create a new session
router.post('/', createSession);

// Get statistics
router.get('/today', getTodayStats);
router.get('/week', getWeekStats);
router.get('/month', getMonthStats);
router.get('/hourly', getHourlyStats);

export default router;

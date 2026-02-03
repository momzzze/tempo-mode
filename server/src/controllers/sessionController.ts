import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/sessionService.js';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Create a new focus session
 * POST /api/sessions
 */
export async function createSession(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const { plannedMinutes, label, actualMinutes } = req.body;

    if (!plannedMinutes || typeof plannedMinutes !== 'number') {
      res.status(400).json({
        error: { message: 'plannedMinutes is required and must be a number' },
      });
      return;
    }

    const session = await SessionService.createSession(
      userId,
      plannedMinutes,
      label,
      actualMinutes
    );

    res.status(201).json({
      data: session,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error creating session');
    next(error);
  }
}

/**
 * Get today's focus statistics
 * GET /api/sessions/today
 */
export async function getTodayStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const stats = await SessionService.getTodayStats(userId);
    res.json({ data: stats });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching today stats');
    next(error);
  }
}

/**
 * Get this week's focus statistics
 * GET /api/sessions/week
 */
export async function getWeekStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const stats = await SessionService.getWeekStats(userId);
    res.json({ data: stats });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching week stats');
    next(error);
  }
}

/**
 * Get this month's focus statistics
 * GET /api/sessions/month
 */
export async function getMonthStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const stats = await SessionService.getMonthStats(userId);
    res.json({ data: stats });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching month stats');
    next(error);
  }
}

/**
 * Get hourly breakdown for today
 * GET /api/sessions/hourly
 */
export async function getHourlyStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Unauthorized' } });
      return;
    }

    const hourlyBreakdown =
      await SessionService.getTodayHourlyBreakdown(userId);
    res.json({ data: hourlyBreakdown });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching hourly stats');
    next(error);
  }
}

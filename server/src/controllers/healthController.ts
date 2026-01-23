import type { NextFunction, Request, Response } from 'express';
import { checkHealth } from '../services/healthService.js';

export async function getHealth(_req: Request, res: Response, next: NextFunction) {
  try {
    const health = await checkHealth();
    res.json(health);
  } catch (error) {
    next(error);
  }
}

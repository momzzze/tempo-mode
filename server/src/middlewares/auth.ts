import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}

export function verifyJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: { message: 'Missing or invalid token' } });
      return;
    }

    const token = authHeader.slice(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      res
        .status(500)
        .json({ error: { message: 'Server configuration error' } });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      sub: string;
      email: string;
      plan?: string;
      iat?: number;
      exp?: number;
    };
    // Map 'sub' to 'id' for consistency
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: { message: 'Token expired' } });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: { message: 'Invalid token' } });
      return;
    }
    logger.error({ err: error }, 'JWT verification error');
    res.status(401).json({ error: { message: 'Unauthorized' } });
  }
}

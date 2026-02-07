import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { User } from '../db/models/User.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: { message: 'email and password are required' } });
    }
    const user = await authService.registerUser(email, password);
    return res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: { message: 'email and password are required' } });
    }
    const result = await authService.loginUser(email, password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId || !req.user?.email) {
      return res.status(401).json({ error: { message: 'Unauthorized' } });
    }

    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    return res.status(200).json({ user: user.toSafe() });
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';

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

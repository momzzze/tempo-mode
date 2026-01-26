import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  const exists = await User.existsByEmail(email);
  if (exists) {
    throw Object.assign(new Error('Email already in use'), { status: 409 });
  }
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create(email, hash);
  return user.toSafe();
}

export async function loginUser(email: string, password: string) {
  const user = await User.findByEmail(email);
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.row.password_hash);
  if (!ok) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw Object.assign(new Error('Server misconfigured: JWT_SECRET missing'), {
      status: 500,
    });
  }
  const safe = user.toSafe();
  const token = jwt.sign(
    { sub: safe.id, email: safe.email, plan: safe.plan },
    secret,
    {
      expiresIn: '7d',
    }
  );
  return { token, user: safe };
}

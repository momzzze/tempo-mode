import { query } from '../../db/pool.js';

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  plan: string;
  created_at: string;
  updated_at: string;
};

export class User {
  constructor(public row: UserRow) {}

  static async findByEmail(email: string): Promise<User | null> {
    const res = await query<UserRow>('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (res.rowCount === 0) return null;
    return new User(res.rows[0]);
  }

  static async existsByEmail(email: string): Promise<boolean> {
    const res = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    return (res.rowCount ?? 0) > 0;
  }

  static async create(email: string, passwordHash: string): Promise<User> {
    const res = await query<UserRow>(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, password_hash, plan, created_at, updated_at`,
      [email, passwordHash]
    );
    return new User(res.rows[0]);
  }

  toSafe() {
    const { password_hash, ...safe } = this.row;
    return safe;
  }
}

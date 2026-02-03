import { query } from '../pool.js';

export type SessionRow = {
  id: string;
  user_id: string;
  label: string | null;
  planned_minutes: number;
  actual_minutes: number;
  completed: boolean;
  interrupted: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
};

export class Session {
  constructor(public row: SessionRow) {}

  /**
   * Create a new focus session
   */
  static async create(
    userId: string,
    plannedMinutes: number,
    label?: string,
    actualMinutes?: number
  ): Promise<Session> {
    const res = await query<SessionRow>(
      `INSERT INTO sessions (user_id, planned_minutes, actual_minutes, label, started_at, completed)
       VALUES ($1, $2, $3, $4, now(), true)
       RETURNING id, user_id, label, planned_minutes, actual_minutes, completed, interrupted, started_at, ended_at, created_at`,
      [userId, plannedMinutes, actualMinutes || plannedMinutes, label || null]
    );
    return new Session(res.rows[0]);
  }

  /**
   * Get all sessions for a user on a specific date
   */
  static async findByUserAndDate(
    userId: string,
    date: string
  ): Promise<Session[]> {
    const res = await query<SessionRow>(
      `SELECT id, user_id, label, planned_minutes, actual_minutes, completed, interrupted, started_at, ended_at, created_at
       FROM sessions
       WHERE user_id = $1 AND DATE(started_at) = $2
       ORDER BY started_at DESC`,
      [userId, date]
    );
    return res.rows.map((row) => new Session(row));
  }

  /**
   * Get all sessions for a user in the last 7 days
   */
  static async getWeeklyStats(userId: string): Promise<SessionRow[]> {
    const res = await query<SessionRow>(
      `SELECT id, user_id, label, planned_minutes, actual_minutes, completed, interrupted, started_at, ended_at, created_at
       FROM sessions
       WHERE user_id = $1 AND started_at >= NOW() - INTERVAL '7 days'
       ORDER BY started_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Get all sessions for a user in the current month
   */
  static async getMonthlyStats(userId: string): Promise<SessionRow[]> {
    const res = await query<SessionRow>(
      `SELECT id, user_id, label, planned_minutes, actual_minutes, completed, interrupted, started_at, ended_at, created_at
       FROM sessions
       WHERE user_id = $1 AND DATE_TRUNC('month', started_at) = DATE_TRUNC('month', NOW())
       ORDER BY started_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Get all sessions for a user on today
   */
  static async getTodayStats(userId: string): Promise<SessionRow[]> {
    const res = await query<SessionRow>(
      `SELECT id, user_id, label, planned_minutes, actual_minutes, completed, interrupted, started_at, ended_at, created_at
       FROM sessions
       WHERE user_id = $1 AND DATE(started_at) = CURRENT_DATE
       ORDER BY started_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Get stats aggregated by day for last N days
   */
  static async getDailyStats(
    userId: string,
    days: number = 7
  ): Promise<Array<{ date: string; total_minutes: number; count: number }>> {
    const res = await query<{
      date: string;
      total_minutes: number;
      count: number;
    }>(
      `SELECT 
        DATE(started_at) as date,
        SUM(actual_minutes) as total_minutes,
        COUNT(*) as count
       FROM sessions
       WHERE user_id = $1 AND started_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(started_at)
       ORDER BY date DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Get stats aggregated by hour for today
   */
  static async getHourlyStats(
    userId: string
  ): Promise<Array<{ hour: number; total_minutes: number; count: number }>> {
    const res = await query<{
      hour: number;
      total_minutes: number;
      count: number;
    }>(
      `SELECT 
        EXTRACT(HOUR FROM started_at)::int as hour,
        SUM(actual_minutes) as total_minutes,
        COUNT(*) as count
       FROM sessions
       WHERE user_id = $1 AND DATE(started_at) = CURRENT_DATE
       GROUP BY EXTRACT(HOUR FROM started_at)
       ORDER BY hour ASC`,
      [userId]
    );
    return res.rows;
  }
}

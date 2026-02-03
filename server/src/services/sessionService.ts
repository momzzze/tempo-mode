import { Session, SessionRow } from '../db/models/Session.js';

export interface StatsSummary {
  totalMinutes: number;
  sessionCount: number;
  averageSessionMinutes: number;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessionCount: number;
}

export interface HourlyStats {
  hour: number;
  totalMinutes: number;
  sessionCount: number;
}

export class SessionService {
  /**
   * Create a new focus session for a user
   */
  static async createSession(
    userId: string,
    plannedMinutes: number,
    label?: string,
    actualMinutes?: number
  ): Promise<SessionRow> {
    const session = await Session.create(
      userId,
      plannedMinutes,
      label,
      actualMinutes
    );
    return session.row;
  }

  /**
   * Get today's statistics
   */
  static async getTodayStats(userId: string): Promise<{
    sessions: SessionRow[];
    summary: StatsSummary;
  }> {
    const sessions = await Session.getTodayStats(userId);
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.actual_minutes || 0),
      0
    );
    const summary: StatsSummary = {
      totalMinutes,
      sessionCount: sessions.length,
      averageSessionMinutes:
        sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    };

    return { sessions, summary };
  }

  /**
   * Get week statistics (last 7 days)
   */
  static async getWeekStats(userId: string): Promise<{
    sessions: SessionRow[];
    summary: StatsSummary;
    dailyBreakdown: DailyStats[];
  }> {
    const sessions = await Session.getWeeklyStats(userId);
    const dailyBreakdown = await Session.getDailyStats(userId, 7);

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.actual_minutes || 0),
      0
    );
    const summary: StatsSummary = {
      totalMinutes,
      sessionCount: sessions.length,
      averageSessionMinutes:
        sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    };

    return {
      sessions,
      summary,
      dailyBreakdown: dailyBreakdown.map((d) => ({
        date: d.date,
        totalMinutes: d.total_minutes,
        sessionCount: d.count,
      })),
    };
  }

  /**
   * Get month statistics
   */
  static async getMonthStats(userId: string): Promise<{
    sessions: SessionRow[];
    summary: StatsSummary;
    dailyBreakdown: DailyStats[];
  }> {
    const sessions = await Session.getMonthlyStats(userId);
    const monthDays = new Date().getDate(); // Days elapsed in current month
    const dailyBreakdown = await Session.getDailyStats(userId, monthDays);

    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.actual_minutes || 0),
      0
    );
    const summary: StatsSummary = {
      totalMinutes,
      sessionCount: sessions.length,
      averageSessionMinutes:
        sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    };

    return {
      sessions,
      summary,
      dailyBreakdown: dailyBreakdown.map((d) => ({
        date: d.date,
        totalMinutes: d.total_minutes,
        sessionCount: d.count,
      })),
    };
  }

  /**
   * Get hourly breakdown for today
   */
  static async getTodayHourlyBreakdown(userId: string): Promise<HourlyStats[]> {
    const hourlyData = await Session.getHourlyStats(userId);
    return hourlyData.map((h) => ({
      hour: h.hour,
      totalMinutes: h.total_minutes,
      sessionCount: h.count,
    }));
  }

  /**
   * Format minutes to human readable time
   */
  static formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}

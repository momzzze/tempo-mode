import { checkConnection } from '../db/pool.js';

export type HealthStatus = {
  status: 'ok';
  db: 'up';
};

export async function checkHealth(): Promise<HealthStatus> {
  const dbUp = await checkConnection();

  if (!dbUp) {
    const error = new Error('Database unreachable');
    (error as Error & { status?: number; code?: string }).status = 503;
    (error as Error & { status?: number; code?: string }).code = 'DB_UNAVAILABLE';
    throw error;
  }

  return { status: 'ok', db: 'up' };
}

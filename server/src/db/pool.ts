import { Pool } from 'pg';
import logger from '../utils/logger.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  logger.warn('DATABASE_URL is not set; database connections will fail until configured');
}

export const pool = new Pool({ connectionString });

export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error({ error }, 'Database connectivity check failed');
    return false;
  }
}

import 'dotenv/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import logger from '../utils/logger.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  logger.warn(
    'DATABASE_URL is not set; database connections will fail until configured'
  );
}

export const pool = new Pool({ connectionString });

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  try {
    return await pool.query<T>(text, params);
  } catch (error) {
    logger.error({ error, query: text }, 'Database query failed');
    throw error;
  }
}

export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error({ error }, 'Database connectivity check failed');
    return false;
  }
}

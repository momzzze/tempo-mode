import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { pool } from './pool.js';
import logger from '../utils/logger.js';

async function run() {
  try {
    const sqlPath = resolve(process.cwd(), 'src', 'db', 'schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    await pool.query(sql);
    logger.info('Database schema applied successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to apply database schema');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();

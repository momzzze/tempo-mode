import 'dotenv/config';
import { readFile } from 'fs/promises';
import { pool } from './pool.js';

async function runMigration() {
  try {
    const sql = await readFile(
      new URL('./migrations/001_timestamp_to_timestamptz.sql', import.meta.url),
      'utf-8'
    );

    console.log('Running migration: Convert TIMESTAMP to TIMESTAMPTZ...');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');

    // Verify changes
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sessions' 
      AND column_name IN ('started_at', 'ended_at', 'created_at')
    `);

    console.log('\nVerification - sessions table columns:');
    result.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

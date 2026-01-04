import { db } from '../src/config/database';
import { logger } from '../src/utils/logger';

async function runMigration() {
    logger.info('Running migration: Adding sentiment and context columns to documents table...', { service: 'plagiarism-backend' });
    try {
        await db.query(`
      ALTER TABLE documents
      ADD COLUMN IF NOT EXISTS sentiment JSONB,
      ADD COLUMN IF NOT EXISTS context JSONB;
    `);
        logger.info('✅ Migration completed successfully.', { service: 'plagiarism-backend' });
    } catch (error) {
        logger.error('❌ Migration failed:', error, { service: 'plagiarism-backend' });
        process.exit(1);
    } finally {
        await db.close(); // Close the connection pool
    }
}

runMigration();

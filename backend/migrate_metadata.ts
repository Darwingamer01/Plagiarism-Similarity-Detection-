
import { db } from './src/config/database';
import { logger } from './src/utils/logger';

async function migrateDb() {
    try {
        logger.info('Running migration: Adding sentiment and context to documents table...');

        await db.query(`
      ALTER TABLE documents 
      ADD COLUMN IF NOT EXISTS sentiment JSONB,
      ADD COLUMN IF NOT EXISTS context JSONB;
    `);

        logger.info('✅ Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Error running migration:', error);
        process.exit(1);
    }
}

migrateDb();

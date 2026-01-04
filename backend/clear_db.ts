
import { db } from './src/config/database';
import { logger } from './src/utils/logger';

async function clearDocuments() {
    try {
        logger.info('Clearing all documents from database...');
        await db.query('DELETE FROM documents');
        await db.query('DELETE FROM similarity_checks');
        logger.info('✅ All documents and similarity checks cleared successfully.');
        process.exit(0);
    } catch (error) {
        logger.error('Error clearing documents:', error);
        process.exit(1);
    }
}

clearDocuments();

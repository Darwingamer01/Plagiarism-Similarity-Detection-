import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config/database';
import { logger } from '../utils/logger';

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        api_key VARCHAR(255) UNIQUE,
        google_id VARCHAR(255),
        apple_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);
    logger.info('✓ Users table created');

    // Add OAuth columns to existing users table if they don't exist
    await db.query(`
      ALTER TABLE users 
      ALTER COLUMN password_hash DROP NOT NULL;
    `).catch(() => logger.info('password_hash already nullable'));

    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
    `);
    
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255);
    `);
    logger.info('✓ OAuth columns added to users table');

    // Create documents table
    await db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER NOT NULL,
        file_path TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        chunks_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      );
    `);
    logger.info('✓ Documents table created');

    // Create document_chunks table
    await db.query(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
        chunk_index INTEGER NOT NULL,
        text_content TEXT NOT NULL,
        start_pos INTEGER NOT NULL,
        end_pos INTEGER NOT NULL,
        embedding_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('✓ Document chunks table created');

    // Create similarity_checks table
    await db.query(`
      CREATE TABLE IF NOT EXISTS similarity_checks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        query_document_id UUID REFERENCES documents(id),
        query_filename VARCHAR(255) NOT NULL,
        similarity_threshold FLOAT NOT NULL,
        max_similarity_score FLOAT,
        status VARCHAR(50) DEFAULT 'processing',
        results JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);
    logger.info('✓ Similarity checks table created');

    // Create audit_logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id UUID,
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('✓ Audit logs table created');

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
      CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_similarity_checks_user_id ON similarity_checks(user_id);
      CREATE INDEX IF NOT EXISTS idx_similarity_checks_status ON similarity_checks(status);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `);
    logger.info('✓ Indexes created');

    logger.info('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}


runMigrations();

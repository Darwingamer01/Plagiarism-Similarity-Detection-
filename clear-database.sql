-- Clear Database Script
-- This will delete ALL data from the database but keep the table structure

-- Disable foreign key checks temporarily
BEGIN;

-- Delete all data from tables (in correct order to avoid foreign key violations)
TRUNCATE TABLE similarity_check_matches CASCADE;
TRUNCATE TABLE similarity_checks CASCADE;
TRUNCATE TABLE document_chunks CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset all sequences (auto-increment counters)
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS documents_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS document_chunks_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS similarity_checks_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS similarity_check_matches_id_seq RESTART WITH 1;

COMMIT;

-- Verify all tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'document_chunks', COUNT(*) FROM document_chunks
UNION ALL
SELECT 'similarity_checks', COUNT(*) FROM similarity_checks
UNION ALL
SELECT 'similarity_check_matches', COUNT(*) FROM similarity_check_matches;

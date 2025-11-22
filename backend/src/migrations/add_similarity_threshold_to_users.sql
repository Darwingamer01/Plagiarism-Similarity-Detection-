-- Add similarity_threshold column to users table
ALTER TABLE users ADD COLUMN similarity_threshold NUMERIC(4,2) DEFAULT 0.88;

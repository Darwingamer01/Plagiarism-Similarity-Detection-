#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - running migrations"
node dist/migrations/runner.js || echo "Migration failed or already completed"

echo "Starting application..."
exec node dist/index.js

#!/bin/sh
# Runs every .sql file in /migrations in filename order, then seed.sql.
# Called by the `migrate` service in docker-compose.yml.
set -e

DB_HOST="${1:-db}"
DB_NAME="${2:-postgres}"

echo "→ Waiting for Postgres + Supabase auth schema to be ready..."
until psql -h "$DB_HOST" -U postgres -d "$DB_NAME" \
      -c "SELECT 1 FROM auth.users LIMIT 1" >/dev/null 2>&1; do
  printf '.'
  sleep 2
done
echo " ready."

echo "→ Applying migrations..."
for sql in $(ls /migrations/*.sql | sort); do
  echo "  $sql"
  psql -h "$DB_HOST" -U postgres -d "$DB_NAME" -f "$sql"
done

echo "→ Loading seed data..."
psql -h "$DB_HOST" -U postgres -d "$DB_NAME" -f /seed.sql

echo "✓ Database ready."

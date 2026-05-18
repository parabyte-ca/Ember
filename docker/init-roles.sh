#!/bin/bash
# Sets passwords for Supabase internal roles from POSTGRES_PASSWORD.
# Runs during first-boot init (all connections are trusted at that stage).
set -e

psql -v ON_ERROR_STOP=1 -U supabase_admin -d postgres <<-EOSQL
  ALTER ROLE supabase_auth_admin    WITH PASSWORD '$POSTGRES_PASSWORD';
  ALTER ROLE authenticator          WITH PASSWORD '$POSTGRES_PASSWORD';
  ALTER ROLE supabase_storage_admin  WITH PASSWORD '$POSTGRES_PASSWORD';
  ALTER ROLE supabase_admin          WITH PASSWORD '$POSTGRES_PASSWORD';
EOSQL

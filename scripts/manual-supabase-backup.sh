#!/bin/sh
set -eu

# Creates a private PostgreSQL backup without storing credentials in Git.
# Obtain the direct/session-pooler database URL from Supabase Database settings,
# then supply it only for this command as SUPABASE_DATABASE_URL.

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump is not installed. Install PostgreSQL client tools first." >&2
  exit 1
fi

if ! command -v pg_restore >/dev/null 2>&1; then
  echo "pg_restore is not installed. Install PostgreSQL client tools first." >&2
  exit 1
fi

if [ -z "${SUPABASE_DATABASE_URL:-}" ]; then
  echo "SUPABASE_DATABASE_URL is required and must not be committed to Git." >&2
  exit 1
fi

case "$SUPABASE_DATABASE_URL" in
  postgres://*|postgresql://*) ;;
  *)
    echo "SUPABASE_DATABASE_URL must be a PostgreSQL connection URL." >&2
    exit 1
    ;;
esac

umask 077
backup_dir="${SWISS_TRAILS_BACKUP_DIR:-$(pwd)/private-backups}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="$backup_dir/swisstrails-$timestamp.dump"

mkdir -p "$backup_dir"
pg_dump --format=custom --no-owner --no-acl --file="$backup_file" "$SUPABASE_DATABASE_URL"
pg_restore --list "$backup_file" >/dev/null

echo "Backup created and structurally checked: $backup_file"
echo "Keep a second encrypted copy outside this computer. A list check is not a full restore rehearsal."

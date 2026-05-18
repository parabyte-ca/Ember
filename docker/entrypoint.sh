#!/bin/bash
set -e

# Always sync node_modules with the bind-mounted workspace.
# The pnpm store volume (see docker-compose.yml) caches downloaded packages,
# so this is near-instant after the first run even though we run it every time.
echo "→ Syncing dependencies (pnpm install)..."
pnpm install --frozen-lockfile

exec "$@"

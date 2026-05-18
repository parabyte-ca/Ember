#!/bin/bash
set -e

# If node_modules was wiped or never populated (e.g. fresh named volume),
# reinstall. pnpm is fast when the lockfile hasn't changed.
if [ ! -d /workspace/node_modules/.pnpm ]; then
  echo "→ node_modules missing — running pnpm install..."
  pnpm install --frozen-lockfile
fi

exec "$@"

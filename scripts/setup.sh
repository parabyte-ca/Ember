#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Ember — Docker dev environment setup
#
#   ./scripts/setup.sh           First-time setup (or restart after changes)
#   ./scripts/setup.sh --reset   Wipe the database and re-run all migrations
#   ./scripts/setup.sh --down    Stop and remove all containers
#   ./scripts/setup.sh --help    Show this message
#
# Requirements: Docker with Compose plugin (no Node/pnpm needed on the host)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DO_RESET=false
DO_DOWN=false
for arg in "$@"; do
  case $arg in
    --reset) DO_RESET=true ;;
    --down)  DO_DOWN=true  ;;
    --help|-h)
      grep '^#' "$0" | grep -v '#!/' | sed 's/^# \{0,1\}//'
      exit 0 ;;
  esac
done

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${BLUE}▶${NC} $*"; }
ok()     { echo -e "${GREEN}✓${NC} $*"; }
warn()   { echo -e "${YELLOW}⚠${NC}  $*"; }
die()    { echo -e "${RED}✗  $*${NC}" >&2; exit 1; }
header() { echo -e "\n${BOLD}── $* ──${NC}"; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
header "1 / 4  Prerequisites"

command -v docker >/dev/null 2>&1 || die "Docker not found.\nInstall Docker Desktop → https://www.docker.com/products/docker-desktop/"

if ! docker info >/dev/null 2>&1; then
  die "Docker daemon is not running.  Start Docker Desktop and try again."
fi
ok "Docker $(docker --version | awk '{print $3}' | tr -d ',')"

if ! docker compose version >/dev/null 2>&1; then
  die "'docker compose' plugin not found.\nUpdate Docker Desktop or install the Compose plugin."
fi
ok "Docker Compose $(docker compose version --short)"

# ── 2. Environment file ───────────────────────────────────────────────────────
header "2 / 4  Environment"

if [ ! -f .env ]; then
  log "Creating .env from .env.example (all local-dev defaults pre-filled)..."
  cp .env.example .env
  ok ".env created"
  warn "The JWT keys in .env are Supabase's public local-dev defaults — safe for"
  warn "local use but change them before any internet-facing deployment."
else
  ok ".env already exists (not overwritten)"
fi

# ── 3. (Optional) database reset ─────────────────────────────────────────────
if $DO_DOWN; then
  header "Stopping containers"
  docker compose down
  ok "All containers stopped"
  exit 0
fi

if $DO_RESET; then
  header "Resetting database"
  log "Removing DB volume (all local data will be wiped)..."
  docker compose down -v db-data 2>/dev/null || true
  docker compose rm -f migrate   2>/dev/null || true
  ok "DB volume removed — will be re-created on next start"
fi

# ── 4. Build + start ──────────────────────────────────────────────────────────
header "3 / 4  Building images"

log "Building dev image (first run downloads ~500 MB; subsequent runs are fast)..."
docker compose build --pull web admin
ok "Images built"

header "4 / 4  Starting services"

log "Starting all services..."
docker compose up -d

# Wait for web to be reachable
log "Waiting for web app to accept connections..."
timeout=120; elapsed=0
until curl -sf http://localhost:3000 >/dev/null 2>&1; do
  sleep 2; elapsed=$((elapsed + 2))
  [ $elapsed -ge $timeout ] && { warn "Timed out waiting for web app — check: docker compose logs web"; break; }
done
[ $elapsed -lt $timeout ] && ok "Web app is up"

cat <<SUMMARY

  ${GREEN}${BOLD}Ember is running.${NC}

  ${BOLD}URLs:${NC}
    Web app         →  http://localhost:3000
    Admin panel     →  http://localhost:3001
    Supabase Studio →  http://localhost:54323   (DB browser)
    Inbucket        →  http://localhost:54324   (catch-all email)

  ${BOLD}Useful commands:${NC}
    docker compose logs -f web          stream web app logs
    docker compose logs -f              stream all logs
    docker compose exec web bash        shell inside the web container
    docker compose exec web pnpm test   run unit tests
    docker compose ps                   show service status
    docker compose down                 stop everything (data preserved)
    docker compose down -v              stop + wipe all volumes

  ${BOLD}Add optional services:${NC}
    Edit .env and set STRIPE_SECRET_KEY, ANTHROPIC_API_KEY, etc.
    Then: docker compose up -d --build web

  ${BOLD}Reset the database:${NC}
    ./scripts/setup.sh --reset

SUMMARY

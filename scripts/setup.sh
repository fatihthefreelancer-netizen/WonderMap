#!/usr/bin/env bash
# WonderMap one-shot local setup (macOS/Linux/Git-Bash).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ Installing workspace dependencies…"
npm install

echo "▶ Preparing environment files…"
[ -f .env ] || cp .env.example .env
[ -f server/.env ] || cp server/.env.example server/.env

echo "▶ Seeding the database (requires MongoDB on \$MONGO_URI)…"
npm run seed

cat <<'EOF'

✅ Setup complete!

  Start everything:   npm run dev
  Client:             http://localhost:5173
  API:                http://localhost:4000/api

  Demo   → demo@wondermap.dev / demo1234
  Admin  → admin@wondermap.dev / admin1234
EOF

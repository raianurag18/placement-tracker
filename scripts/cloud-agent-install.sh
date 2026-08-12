#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f backend/.env ]; then
  cat > backend/.env <<'EOF'
MONGO_URI=mongodb://127.0.0.1:27017/placement_tracker
JWT_SECRET=dev-jwt-secret-change-in-production
ADMIN_PASSWORD=admin123
STUDENT_PASSWORD=student123
ADMIN_EMAIL=admin@bitmesra.edu
SEED_STUDENT_PASSWORD=student123
PORT=5000
EOF
  echo "Created backend/.env with local development defaults"
fi

npm ci --prefix backend
npm ci --prefix placement_tracker

node scripts/bootstrap-dev-db.js
( cd backend && node utils/seedTestTenants.js && node utils/seedJobs.js )

echo "Cloud Agent install complete"

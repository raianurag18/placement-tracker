#!/usr/bin/env bash
set -euo pipefail

if ! command -v mongod >/dev/null 2>&1 || ! command -v mongosh >/dev/null 2>&1; then
  echo "MongoDB binaries not found (need mongod + mongosh)." >&2
  echo "Restore .cursor/Dockerfile (mongodb-org) and the environment.json build.dockerfile block," >&2
  echo "then rebuild the Cloud Agent environment image." >&2
  exit 127
fi

if [ "$(id -u)" -eq 0 ]; then
  DB_PATH="${MONGO_DATA_PATH:-/var/lib/mongodb}"
  LOG_PATH="${MONGO_LOG_PATH:-/var/log/mongodb/mongod.log}"
  PID_FILE="${MONGO_PID_FILE:-/var/run/mongodb/mongod.pid}"
else
  DB_PATH="${MONGO_DATA_PATH:-$HOME/.mongodb/data}"
  LOG_PATH="${MONGO_LOG_PATH:-$HOME/.mongodb/mongod.log}"
  PID_FILE="${MONGO_PID_FILE:-$HOME/.mongodb/mongod.pid}"
fi

mkdir -p "$DB_PATH" "$(dirname "$LOG_PATH")" "$(dirname "$PID_FILE")"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "MongoDB already running (pid $(cat "$PID_FILE"))"
else
  rm -f "$PID_FILE"
  mongod \
    --dbpath "$DB_PATH" \
    --logpath "$LOG_PATH" \
    --pidfilepath "$PID_FILE" \
    --bind_ip 127.0.0.1 \
    --port 27017 \
    --fork
  echo "MongoDB started"
fi

for _ in $(seq 1 30); do
  if mongosh --quiet --eval 'db.runCommand({ ping: 1 }).ok' >/dev/null 2>&1; then
    echo "MongoDB is ready"
    exit 0
  fi
  sleep 1
done

echo "MongoDB failed to become ready" >&2
exit 1

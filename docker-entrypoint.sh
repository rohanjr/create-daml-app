#!/bin/bash
set -euo pipefail
set -m

LEDGER_HOST=localhost
LEDGER_PORT=6865

service nginx start

./daml-start.sh \
  --sandbox-option --sql-backend-jdbcurl \
  --sandbox-option "$DATABASE_JDBC_URL" \
  &

sleep 5
until nc -z $LEDGER_HOST $LEDGER_PORT; do
  echo "Waiting for sandbox."
  sleep 1
done
echo "Connected to sandbox."

daml deploy --host $LEDGER_HOST --port $LEDGER_PORT

./daml-trigger.sh Alice &

fg %1

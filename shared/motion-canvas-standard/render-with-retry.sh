#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <timeout> <command...>" >&2
  exit 2
fi

LIMIT="$1"
shift
MAX_ATTEMPTS="${MAX_ATTEMPTS:-2}"
RETRY_DELAY="${RETRY_DELAY:-3}"

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
  echo "[render-retry] attempt $attempt/$MAX_ATTEMPTS: timeout=$LIMIT command=$*"
  set +e
  timeout --signal=TERM --kill-after=30s "$LIMIT" "$@"
  code=$?
  set -e

  if [ "$code" -eq 0 ]; then
    echo "[render-retry] success on attempt $attempt"
    exit 0
  fi

  if [ "$code" -eq 124 ] || [ "$code" -eq 137 ] || [ "$code" -eq 143 ]; then
    echo "[render-retry] render exceeded timeout or was terminated (exit=$code)" >&2
  else
    echo "[render-retry] render failed (exit=$code)" >&2
  fi

  if [ "$attempt" -lt "$MAX_ATTEMPTS" ]; then
    echo "[render-retry] clearing likely partial outputs before retry"
    sleep "$RETRY_DELAY"
  fi
done

echo "[render-retry] all attempts failed" >&2
exit 1

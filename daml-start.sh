#!/bin/sh
daml start \
  --open-browser=no \
  --start-navigator=no \
  --sandbox-option='--ledgerid=create-daml-app-sandbox' \
  --sandbox-option=--eager-package-loading \
  --sandbox-option=--wall-clock-time \
  --json-api-option='--application-id=create-daml-app'

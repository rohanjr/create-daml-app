#!/bin/sh
daml trigger \
  --wall-clock-time \
  --dar .daml/dist/create-daml-app-0.1.0.dar \
  --trigger-name Reciprocate:trigger \
  --ledger-host localhost \
  --ledger-port 6865 \
  --ledger-party $1

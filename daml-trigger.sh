#!/bin/sh
daml trigger --dar .daml/dist/create-daml-app-0.1.0.dar --trigger-name Mirror:trigger --wall-clock-time --ledger-host localhost --ledger-port 6865 --ledger-party Alice

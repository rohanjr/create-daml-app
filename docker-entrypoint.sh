#!/bin/bash
set -euxo pipefail

LOG=$HOME/var/log/all
mkdir -p $(dirname $LOG)
echo "Starting create-daml-app..." > $LOG

service nginx start

./daml-start.sh >> $LOG &
sleep 10 && ./daml-trigger.sh Alice >> $LOG &

exec tail -f $LOG

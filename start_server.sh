#!/bin/sh

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd )"

(
cd $SCRIPTPATH/server
[ -e node_modules ] || npm install
)
#export PORT=3000
node $SCRIPTPATH/server/server.js -v $*

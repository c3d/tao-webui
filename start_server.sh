#!/bin/sh

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd )"

(
cd $SCRIPTPATH/server
for m in express htmlparser ent http-proxy ejs; do
  [ -e node_modules/$m ] || npm install $m
done
)
#export PORT=3000
node $SCRIPTPATH/server/server.js -v $*

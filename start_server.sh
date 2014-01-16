#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd )"

error() {
  echo $1 >&2
  exit
}

[ -e "$SCRIPTPATH/node_modules" ] || ( cd "$SCRIPTPATH" && npm install )
[ -e "$SCRIPTPATH/www/ext-4" ] || error "ExtJS 4 not found under www/ext-4. Please install it from http://www.sencha.com/products/extjs/download."

#export PORT=3000
node "$SCRIPTPATH/server/server.js" -v $*

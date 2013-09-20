#!/bin/sh

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd )"

error() {
  echo $1 >&2
  exit
}

pushd . >/dev/null
cd "$SCRIPTPATH/server"
[ -e node_modules ] || npm install
popd >/dev/null
[ -e "$SCRIPTPATH/www/ext-4" ] || error "ExtJS 4 not found under www/ext-4. Please install it from http://www.sencha.com/products/extjs/download."

#export PORT=3000
node "$SCRIPTPATH/server/server.js" -v $*

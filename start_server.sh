#!/bin/sh

#export PORT=3000
[ -e node_modules ] || npm install express
node server.js

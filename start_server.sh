#!/bin/sh

#export PORT=3000
cd server
[ -e node_modules ] || npm install express
node server.js

#!/bin/sh

#export PORT=3000
cd server
[ -e node_modules ] || npm install express htmlparser ent
node server.js

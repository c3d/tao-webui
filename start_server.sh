#!/bin/sh

#export PORT=3000
cd server
for m in express htmlparser ent http-proxy ; do
  [ -e node_modules/$m ] || npm install $m
done
node server.js

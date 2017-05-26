#!/usr/bin/env bash

rm -rf ./tmp
mkdir ./tmp

cp -r ../../../models ./tmp/models
cp -r ../../../public ./tmp/public
cp ../../../db.js ./tmp/
cp ../../../server.js ./tmp/
#cp ../../../application.yml ./tmp/
cp ../../../package.json ./tmp/

../build/build.sh

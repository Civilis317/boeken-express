#!/usr/bin/env bash

rm -rf ./tmp
mkdir ./tmp

cp -r ../../../models ./tmp/models
cp -r ../../../public ./tmp/public
cp ../../../db.js ./tmp/
cp ../../../server.js ./tmp/
#cp ../../../application.yml ./tmp/
cp ../../../package.json ./tmp/

set -o pipefail

IMAGE_NAME=civilis/nodejs-server

TAG_NAME=192.168.99.100:6000/${IMAGE_NAME}

if [ -z "$1" ];
then
    echo "unknown version number, aborting build"
    exit
else
    echo "Version passed as param: $1"
    VERSION="$1"
fi

docker build --no-cache=true -t ${IMAGE_NAME}:${VERSION} . | tee build.log || exit 1

docker tag ${IMAGE_NAME}:${VERSION} ${TAG_NAME}:${VERSION}
docker tag ${IMAGE_NAME}:${VERSION} ${TAG_NAME}:latest

docker push ${TAG_NAME}:${VERSION}
docker push ${TAG_NAME}:latest


docker images | grep ${IMAGE_NAME}


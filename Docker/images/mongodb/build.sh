#!/usr/bin/env bash

set -o pipefail

IMAGE_NAME=civilis/mongo-image

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


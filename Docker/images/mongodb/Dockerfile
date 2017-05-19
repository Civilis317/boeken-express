FROM mongo:3.4
MAINTAINER civilis@acme.com

COPY mongod.conf /etc/

VOLUME ["/data/db"]
WORKDIR /data

EXPOSE 27017

CMD ["mongod"]


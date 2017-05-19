FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy relevant files and folders
COPY ./tmp/models /usr/src/app/models
COPY ./tmp/public /usr/src/app/public
COPY ./tmp/db.js /usr/src/app/
COPY ./tmp/server.js /usr/src/app/
#COPY ./tmp/application.yml /usr/src/app/

# Install app dependencies
COPY ./tmp/package.json /usr/src/app/
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]

FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy relevant files and folders
COPY ../../models /usr/src/app/models
COPY ../../public /usr/src/app/public
COPY ../../db.js /usr/src/app/
COPY ../../server.js /usr/src/app/
COPY ../../application.yml /usr/src/app/

# Install app dependencies
COPY ../../package.json /usr/src/app/
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]

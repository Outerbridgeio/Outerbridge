FROM --platform=linux/amd64 node:14.20.0-alpine

USER root

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# we need lerna.json in container for yarn bootstrap script
COPY lerna.json /app/lerna.json

# run setup scripts
RUN yarn setup
RUN yarn bootstrap
RUN yarn build

# Bundle app source
COPY . .

# cd into directory that starts outerbridge app
WORKDIR /app/packages/server

CMD ["yarn", "start"]
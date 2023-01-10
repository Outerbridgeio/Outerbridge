FROM node:14.20.0-alpine

USER root

RUN apk add --no-cache git

# You can install a specific version like: outerbridge@1.0.5
RUN npm install -g outerbridge

WORKDIR /data

CMD "outerbridge"
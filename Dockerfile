FROM node:16

WORKDIR /usr/src/packages

# Copy root package.json and lockfile
COPY package.json ./
COPY yarn.lock ./

# Copy the docs package.json
COPY packages/components/package.json ./packages/components/package.json

# Copy the docs package.json
COPY packages/ui/package.json ./packages/ui/package.json

# Copy the docs package.json
COPY packages/server/package.json ./packages/server/package.json

RUN yarn install

# Copy app source
COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "dev" ]
ARG tag

FROM node:$tag AS development
RUN \
  apk add --no-cache shadow \
  && mkdir -p /home/node/app \
  && chown -R node:node /home/node/app \
  && mkdir -p /home/node/app/temp \
  && chown -R node:node /home/node/app/temp \
  && mkdir -p /home/node/app/storage \
  && chown -R node:node /home/node/app/storage
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build

FROM node:$tag AS production
RUN \
  apk add --no-cache shadow \
  && mkdir -p /home/node/app \
  && chown -R node:node /home/node/app \
  && mkdir -p /home/node/app/temp \
  && chown -R node:node /home/node/app/temp \
  && mkdir -p /home/node/app/storage \
  && chown -R node:node /home/node/app/storage
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install --only=production
COPY --chown=node:node . .
RUN \
  rm -rf ./src \
  && rm ./nest-cli.json \
  && rm ./tsconfig.build.json \
  && rm ./tsconfig.json
COPY --chown=node:node --from=development /home/node/app/dist ./dist

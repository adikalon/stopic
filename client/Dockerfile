ARG tag

FROM node:$tag AS development
RUN \
  apk add --no-cache shadow \
  && mkdir -p /home/node/app \
  && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build:ssr

FROM node:$tag AS production
RUN \
  apk add --no-cache shadow \
  && mkdir -p /home/node/app \
  && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install --only=production
COPY --chown=node:node . .
RUN \
  rm -rf ./src \
  && rm ./.browserslistrc \
  && rm ./angular.json \
  && rm ./karma.conf.js \
  && rm ./tsconfig.app.json \
  && rm ./tsconfig.json \
  && rm ./tsconfig.server.json \
  && rm ./tsconfig.spec.json
COPY --chown=node:node --from=development /home/node/app/dist ./dist

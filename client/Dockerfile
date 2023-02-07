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
RUN npm run build

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
  rm -rf ./assets \
  && rm -rf ./components \
  && rm -rf ./layouts \
  && rm -rf ./middleware \
  && rm -rf ./pages \
  && rm -rf ./store \
  && rm ./.eslintrc.js
COPY --chown=node:node --from=development /home/node/app/.nuxt ./.nuxt

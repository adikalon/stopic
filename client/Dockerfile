ARG tag

FROM node:$tag AS development
ARG app_name
ARG app_url
ARG yandex_metrika_id
ARG google_analytics_id
RUN \
  apk add --no-cache shadow \
  && mkdir -p /home/node/app \
  && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN APP_NAME=${app_name} APP_URL=${app_url} YANDEX_METRIKA_ID=${yandex_metrika_id} GOOGLE_ANALYTICS_ID=${google_analytics_id} npm run build

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
  && rm ./app.html \
  && rm ./.eslintrc.js
COPY --chown=node:node --from=development /home/node/app/.nuxt ./.nuxt

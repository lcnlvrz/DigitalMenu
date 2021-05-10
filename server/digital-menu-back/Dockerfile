FROM node:12-alpine

ENV NODE_ENV development

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENTRYPOINT ["yarn", "start:dev"]

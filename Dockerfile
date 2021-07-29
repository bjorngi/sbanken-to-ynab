FROM node:16-alpine as builder
RUN apk update
WORKDIR /build
COPY . .

RUN npm install
RUN npm run lint
RUN npm run build

FROM node:16-alpine as release
WORKDIR /app
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
ENV TZ Europe/Oslo

ARG build_VERSION

ENV VERSION=$build_VERSION

CMD node ./dist/syncSbankenToYnab.js


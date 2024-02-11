FROM node:20.11.0-alpine3.18 AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 5001
RUN npm run build
CMD npm run generate && npm run migrate && node dist/server.js

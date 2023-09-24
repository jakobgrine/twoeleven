FROM node:hydrogen-alpine AS builder

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM httpd:alpine AS server

COPY --from=builder /opt/app/dist /usr/local/apache2/htdocs

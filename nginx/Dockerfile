FROM nginx:1.27-alpine

RUN apk add --no-cache nginx-mod-http-brotli

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

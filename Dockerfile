FROM alpine:3 as checkouter

RUN apk --no-cache add git

RUN git clone https://github.com/metowolf/Meting-API.git /mteing-api \
    && cd /mteing-api \
    && git checkout d7782b5


FROM node:17-alpine as prod

COPY --from=0 /mteing-api /mteing-api

RUN apk update && apk add openrc \
    php8 \
    php8-fpm \
    php8-opcache \
    php8-bcmath \
    php8-curl \
    php8-mbstring \
    php8-json \
    php8-openssl \
    composer \
    nginx

# openrc
RUN mkdir -p /run/openrc && touch /run/openrc/softlevel

RUN cp -rp /mteing-api/api/root/var/* /var/

# composer
RUN cd /var/www/meting \ 
    && composer install --no-dev --optimize-autoloader \
    && composer clearcache

# log
RUN chown -R nginx /var/log/nginx

# clean
RUN apk del composer && rm -rf /var/cache/apk/*

RUN cp -rp /mteing-api/api/root/etc/* /etc \
    && cp -rp /mteing-api/api/root/usr/* /usr

WORKDIR /mteing-api/server

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}
ENV METING_API http://127.0.0.1/api

RUN yarn
RUN sed -i 's/daemon off/daemon on/g' /usr/local/bin/docker-entrypoint.sh \
    && echo -e "\nnode src/index.js" >>/usr/local/bin/docker-entrypoint.sh

COPY server/src/config.js src/config.js
COPY server/src/service/api.js src/service/api.js

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

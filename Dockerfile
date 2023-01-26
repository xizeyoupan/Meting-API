FROM alpine:3 as checkouter

RUN apk --no-cache add git

RUN git clone https://github.com/metowolf/Meting-API.git /meting-api \
    && cd /meting-api \
    && git checkout d7782b5

WORKDIR /meting-api

RUN sed -i 's/daemon off/daemon on/g' api/root/usr/local/bin/docker-entrypoint.sh \
    && echo -e "\nnode src/index.js" >> api/root/usr/local/bin/docker-entrypoint.sh \
    && sed '1a id' -i api/root/usr/local/bin/docker-entrypoint.sh \
    && sed -i 's/listen 80/listen 8080/g' api/root/etc/nginx/conf.d/default.conf \
    && sed -i 's/listen \[::\]:80/listen \[::\]:8080/g' api/root/etc/nginx/conf.d/default.conf

FROM node:17-alpine as prod

ARG UID
ARG GID

ENV UID=${UID:-1010}
ENV GID=${GID:-1010}

RUN addgroup -g ${GID} --system meting \
    && adduser -G meting --system -D -s /bin/sh -u ${UID} meting

COPY --from=0 /meting-api /meting-api

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

RUN cp -rp /meting-api/api/root/var/* /var/

# composer
RUN cd /var/www/meting \ 
    && composer install --no-dev --optimize-autoloader \
    && composer clearcache

# log
RUN chown -R nginx /var/log/nginx

# clean
RUN apk del composer && rm -rf /var/cache/apk/*

RUN cp -rp /meting-api/api/root/etc/* /etc \
    && cp -rp /meting-api/api/root/usr/* /usr

WORKDIR /meting-api/server

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-production}
ENV METING_API http://localhost:8080/api

RUN yarn

COPY server/src/config.js src/config.js
COPY server/src/service/api.js src/service/api.js
COPY server/src/index.js src/index.js

RUN chown -R meting:meting /var
RUN chown -R meting:meting /etc/php8
USER meting

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]

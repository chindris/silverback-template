# ====================================================================================================
# BUILDER IMAGE
# ====================================================================================================
FROM uselagoon/node-18-builder as builder

# Install pnpm
RUN npm install -g pnpm@8 turbo && pnpm config set store-dir /tmp/cache/pnpm
COPY .npmrc /etc/npmrc
# Copy pnpm lockfile and install only dependencies required for building.
COPY pnpm-lock.yaml /app/

# Install dependencies with a cached pnpm store.
RUN --mount=type=cache,target=/tmp/cache pnpm fetch

# Copy the all package sources, install dev packages from local storage and prepare them.
COPY . /app
# TODO:
# - Avoid installing optional dependencies. Currently its necessary tue to swc
# - Find a cleaner solution to delete all node_modules folders
RUN --mount=type=cache,target=/tmp/cache pnpm install --frozen-lockfile --prefer-offline && \
    pnpm prep && \
    rm -rf node_modules apps/*/node_modules packages/*/node_modules packages/*/*/node_modules

# === CMS DEPLOY ===
RUN turbo prune --scope "@custom/cms" --docker --out-dir .deploy/cms
RUN turbo prune --scope "@custom/website" --docker --out-dir .deploy/website

# ====================================================================================================
# CLI IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-cli-drupal as cli

RUN apk add --no-cache git qpdf imagemagick icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl
RUN composer config --global github-protocols https

COPY --from=builder /app/.deploy/cms/full/apps/cms/composer.json /app/apps/cms/composer.json
COPY --from=builder /app/.deploy/cms/full/apps/cms/composer.lock /app/apps/cms/composer.lock
COPY --from=builder /app/.deploy/cms/full/apps/cms/scaffold /app/apps/cms/scaffold
# Enable this when patches exist.
#COPY --from=builder /app/.deploy/cms/full/apps/cms/patches /app/apps/cms/patches
ENV COMPOSER_HOME=/tmp/cache/composer
WORKDIR /app/apps/cms
RUN --mount=type=cache,target=/tmp/cache composer install --no-dev

COPY --from=builder /app/.deploy/cms/full /app

RUN cd web/modules && rm -rf custom && ln -s ../../../../packages/drupal custom

ENV WEBROOT=/app/apps/cms/web

# ====================================================================================================
# PHP IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-fpm as php
RUN apk add --no-cache imagemagick qpdf icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl

COPY --from=cli /app /app

WORKDIR /app/apps/cms
ENV WEBROOT=web

# ====================================================================================================
# NGINX IMAGE
# ====================================================================================================
FROM amazeeio/nginx-drupal as nginx

COPY --from=cli /app /app
COPY .lagoon/nginx-conf/redirects-map.conf /etc/nginx/redirects-map.conf

ENV WEBROOT=apps/cms/web

# ====================================================================================================
# PUBLISHER IMAGE
# ====================================================================================================

FROM uselagoon/node-18 as publisher

# DENO INSTALL
ENV ALPINE_GLIBC_BASE_URL="https://github.com/sgerrand/alpine-pkg-glibc/releases/download"
ENV ALPINE_GLIBC_PACKAGE_VERSION="2.34-r0"
ENV ALPINE_GLIBC_BASE_PACKAGE_FILENAME="glibc-$ALPINE_GLIBC_PACKAGE_VERSION.apk"
ENV ALPINE_GLIBC_BIN_PACKAGE_FILENAME="glibc-bin-$ALPINE_GLIBC_PACKAGE_VERSION.apk"
ENV ALPINE_GLIBC_I18N_PACKAGE_FILENAME="glibc-i18n-$ALPINE_GLIBC_PACKAGE_VERSION.apk"

RUN echo "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_BASE_PACKAGE_FILENAME"

RUN apk add --no-cache --virtual=.build-dependencies wget ca-certificates && \
    echo "-----BEGIN PUBLIC KEY-----        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZ2u1KJKUu/fW4A25y9m        y70AGEa/J3Wi5ibNVGNn1gT1r0VfgeWd0pUybS4UmcHdiNzxJPgoWQhV2SSW1JYu        tOqKZF5QSN6X937PTUpNBjUvLtTQ1ve1fp39uf/lEXPpFpOPL88LKnDBgbh7wkCp        m2KzLVGChf83MS0ShL6G9EQIAUxLm99VpgRjwqTQ/KfzGtpke1wqws4au0Ab4qPY        KXvMLSPLUp7cfulWvhmZSegr5AdhNw5KNizPqCJT8ZrGvgHypXyiFvvAH5YRtSsc        Zvo9GI2e2MaZyo9/lvb+LbLEJZKEQckqRj4P26gmASrZEPStwc+yqy1ShHLA0j6m        1QIDAQAB        -----END PUBLIC KEY-----" | sed 's/   */\n/g' > "/etc/apk/keys/sgerrand.rsa.pub" && \
    wget "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" \
      "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" \
      "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_I18N_PACKAGE_FILENAME" && \
    mv /etc/nsswitch.conf /etc/nsswitch.conf.bak && \
    apk add --no-cache --force-overwrite  \
      "$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" \
      "$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" \
      "$ALPINE_GLIBC_I18N_PACKAGE_FILENAME" && \
    mv /etc/nsswitch.conf.bak /etc/nsswitch.conf && \
    rm "/etc/apk/keys/sgerrand.rsa.pub" && \
    (/usr/glibc-compat/bin/localedef --force --inputfile POSIX --charmap UTF-8 "$LANG" || true) && \
    echo "export LANG=$LANG" > /etc/profile.d/locale.sh && \
    apk del glibc-i18n && \
    apk del .build-dependencies && \
    rm "$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" "$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" "$ALPINE_GLIBC_I18N_PACKAGE_FILENAME"

RUN apk add --no-cache sqlite curl

RUN npm install -g pnpm@8
ENV DENO_INSTALL="/home/.deno"
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN ln -s /home/.deno/bin/deno /usr/local/bin/deno

COPY --from=builder /app/.deploy/website/json /app
RUN --mount=type=cache,target=/tmp/cache pnpm install --prod --ignore-scripts
RUN npm rebuild sqlite3
COPY --from=builder /app/.deploy/website/full /app

RUN mkdir -p /home/.cache/deno/gen && chown -R user:user /home/.cache/deno

WORKDIR /app/apps/website
CMD pnpm publisher

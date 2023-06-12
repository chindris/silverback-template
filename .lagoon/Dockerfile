# ====================================================================================================
# BUILDER IMAGE
# ====================================================================================================
FROM uselagoon/node-18-builder as builder

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install pnpm
RUN npm install -g pnpm@8 && pnpm config set store-dir /tmp/cache/pnpm

# Copy pnpm lockfile and install dependencies.
COPY pnpm-lock.yaml .npmrc /app/
COPY patches /app/patches
RUN --mount=type=cache,target=/tmp/cache pnpm fetch && \
    # There is a bug in pnpm: `pnpm fetch` creates _some_ node_modules folders
    # with _some_ packages. This can lead to an incomplete package installation.
    # So we remove them now.
    find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

# Copy the all package sources, install and prepare them.
COPY . /app
RUN --mount=type=cache,target=/tmp/cache pnpm i && \
    pnpm turbo:prep && \
    # Remove all node_modules to reduce the size of the image.
    find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

# Deploy apps.
RUN --mount=type=cache,target=/tmp/cache pnpm deploy --filter "@custom/cms" /tmp/.deploy/cms --prod
RUN --mount=type=cache,target=/tmp/cache pnpm deploy --filter "@custom/website" /tmp/.deploy/website --prod

# ====================================================================================================
# CLI IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-cli-drupal as cli

RUN apk add --no-cache git qpdf imagemagick icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl
RUN composer config --global github-protocols https

COPY --from=builder /tmp/.deploy/cms/composer.json /app/composer.json
COPY --from=builder /tmp/.deploy/cms/composer.lock /app/composer.lock
COPY --from=builder /tmp/.deploy/cms/scaffold /app/scaffold
# Enable this when patches exist.
#COPY --from=builder /app/.deploy/cms/patches /app/patches
ENV COMPOSER_HOME=/tmp/cache/composer
RUN --mount=type=cache,target=/tmp/cache composer install --no-dev

COPY --from=builder /tmp/.deploy/cms /app

WORKDIR /app
ENV WEBROOT=web

# ====================================================================================================
# PHP IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-fpm as php
RUN apk add --no-cache imagemagick qpdf icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl

COPY --from=cli /app /app

WORKDIR /app
ENV WEBROOT=web

# ====================================================================================================
# NGINX IMAGE
# ====================================================================================================
FROM amazeeio/nginx-drupal as nginx

COPY --from=cli /app /app
COPY .lagoon/nginx-conf/redirects-map.conf /etc/nginx/redirects-map.conf

WORKDIR /app
ENV WEBROOT=web

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

COPY --from=builder /tmp/.deploy/website /app

RUN mkdir -p /home/.cache/deno/gen && chmod -R 777 /home/.cache/deno

CMD pnpm publisher

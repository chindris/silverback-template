# ====================================================================================================
# BUILDER IMAGE
# ====================================================================================================
FROM uselagoon/node-18-builder as builder

# Install pnpm
RUN npm install -g pnpm && pnpm config set store-dir /tmp/cache/pnpm
# Copy pnpm lockfile and install only dependencies required for building.
COPY pnpm-lock.yaml /app/

# Install dependencies with a cached pnpm store.
RUN --mount=type=cache,target=/tmp/cache  \
  pnpm fetch --dev && \
  pnpm fetch --prod

# Copy the all package sources, install dev packages from local storage and build.
COPY . /app
RUN --mount=type=cache,target=/tmp/cache pnpm install --no-optional --frozen-lockfile --prefer-offline
RUN pnpm build

# === CMS DEPLOY ===
RUN --mount=type=cache,target=/tmp/cache pnpm deploy --filter "@PROJECT_MACHINE_NAME/cms" .deploy/cms --prod

# ====================================================================================================
# CLI IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-cli-drupal as cli

RUN apk add --no-cache git qpdf imagemagick icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl
RUN composer config --global github-protocols https

COPY --from=builder /app/.deploy/cms/composer.json /app/composer.json
COPY --from=builder /app/.deploy/cms/composer.lock /app/composer.lock
COPY --from=builder /app/.deploy/cms/scaffold /app/scaffold
# Enable this when patches exist.
#COPY --from=builder /app/.deploy/cms/patches /app/patches
COPY --from=builder /app/.deploy/cms/node_modules /app/node_modules
ENV COMPOSER_HOME=/tmp/cache/composer
RUN --mount=type=cache,target=/tmp/cache composer install --no-dev

COPY --from=builder /app/.deploy/cms /app

ENV WEBROOT=/app/web

# ====================================================================================================
# PHP IMAGE
# ====================================================================================================
FROM uselagoon/php-8.1-fpm as php
RUN apk add --no-cache imagemagick qpdf icu-dev && \
  docker-php-ext-install intl && \
  docker-php-ext-enable intl

COPY --from=cli /app /app
WORKDIR /app
ENV WEBROOT=/app/web

# ====================================================================================================
# NGINX IMAGE
# ====================================================================================================
FROM amazeeio/nginx-drupal as nginx

COPY --from=cli /app /app
COPY .lagoon/nginx-conf/redirects-map.conf /etc/nginx/redirects-map.conf

ENV WEBROOT=web

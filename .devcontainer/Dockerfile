FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN node --version

# Install pnpm 8.6+
RUN npm install -g pnpm@8.6.12
RUN pnpm --version

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev

# Install additional PHP extensions for Drupal
RUN docker-php-ext-install opcache
RUN pecl install apcu && docker-php-ext-enable apcu

RUN nvm use 18
RUN npm i -g pnpm@8.6.12

WORKDIR /workspaces/silverback-template/apps/cms
RUN apt-get update && apt-get install -y git qpdf imagemagick libicu-dev && \
    docker-php-ext-install intl && \
    docker-php-ext-enable intl
RUN composer config --global github-protocols https

# Change document root for Apache
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/web!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Enable Apache modules
RUN a2enmod rewrite

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

# Install nvm, Node.js 18, and pnpm 8.6.12
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 18.18.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Verify Node.js installation
RUN node --version

# Install specific pnpm version
RUN npm install -g pnpm@8.6.12

# Verify pnpm installation
RUN pnpm --version

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev

# Install additional PHP extensions for Drupal
RUN docker-php-ext-install opcache
RUN pecl install apcu && docker-php-ext-enable apcu

# Set working directory
WORKDIR /var/www/html

# Change document root for Apache
RUN sed -ri -e 's!/var/www/html!/var/www/html/web!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/web!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Enable Apache modules
RUN a2enmod rewrite

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
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install pnpm
RUN npm install -g pnpm

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

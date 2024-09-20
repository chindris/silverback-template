FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install Node.js
ARG NODE_VERSION="18.19.0"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} && nvm alias default ${NODE_VERSION}"
RUN echo "nvm use default &>/dev/null" >> ~/.bashrc

# Install PHP and extensions
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends php8.2 php8.2-gd php8.2-mbstring php8.2-curl php8.2-sqlite3 php8.2-zip php8.2-xdebug php8.2-imagick

# Install Playwright dependencies
RUN su vscode -c "npm install -g pnpm@8.6.12 @withgraphite/graphite-cli && pnpm dlx playwright@1.32.3 install-deps && pnpm dlx playwright@1.32.3 install"

# Copy xdebug configuration
COPY .devcontainer/xdebug.ini /etc/php/8.2/mods-available/xdebug.ini

# Install Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN echo 'export DENO_INSTALL="/home/vscode/.deno"' >> /home/vscode/.bashrc && \
    echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/vscode/.bashrc && \
    /home/vscode/.deno/bin/deno completions bash > /home/vscode/.bashrc.d/90-deno

# Install Helix editor
RUN apt-get update && apt-get install -y software-properties-common && \
    add-apt-repository ppa:maveonair/helix-editor && \
    apt-get update && \
    apt-get install -y helix

# Install phpactor
RUN curl -Lo phpactor.phar https://github.com/phpactor/phpactor/releases/latest/download/phpactor.phar && \
    chmod a+x phpactor.phar && \
    mv phpactor.phar /usr/local/bin/phpactor

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt update \
    && apt install gh -y

# Clean up
RUN apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

USER vscode

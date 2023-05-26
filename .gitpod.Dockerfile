FROM gitpod/workspace-full
RUN sudo update-alternatives --set php $(which php8.1)
RUN sudo install-packages php8.1-gd php8.1-mbstring php8.1-curl php8.1-sqlite3 php8.1-zip php8.1-xdebug
RUN pnpx playwright@1.32.3 install-deps
RUN pnpx playwright@1.32.3 install

# RUN echo "zend_extension=xdebug.so\nxdebug.mode = debug\nxdebug.client_host = 127.0.0.1\nxdebug.client_port = 9003\nxdebug.start_with_request = trigger" >> /etc/php/8.1/cli/conf.d/20-xdebug.ini
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN /home/gitpod/.deno/bin/deno completions bash > /home/gitpod/.bashrc.d/90-deno && \
    echo 'export DENO_INSTALL="/home/gitpod/.deno"' >> /home/gitpod/.bashrc.d/90-deno && \
    echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/gitpod/.bashrc.d/90-deno

FROM gitpod/workspace-full
RUN sudo update-alternatives --set php $(which php8.1)
RUN sudo install-packages php8.1-gd php8.1-mbstring php8.1-curl php8.1-sqlite3 php8.1-zip php8.1-xdebug
RUN pnpx playwright@1.32.3 install-deps
RUN pnpx playwright@1.32.3 install

COPY .gitpod/xdebug.ini /etc/php/8.1/mods-available/xdebug.ini
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN /home/gitpod/.deno/bin/deno completions bash > /home/gitpod/.bashrc.d/90-deno && \
    echo 'export DENO_INSTALL="/home/gitpod/.deno"' >> /home/gitpod/.bashrc.d/90-deno && \
    echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/gitpod/.bashrc.d/90-deno

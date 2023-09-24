FROM gitpod/workspace-full
RUN sudo update-alternatives --set php $(which php8.1)
RUN sudo install-packages php8.1-gd php8.1-mbstring php8.1-curl php8.1-sqlite3 php8.1-zip php8.1-xdebug php8.1-imagick
RUN pnpx playwright@1.32.3 install-deps
RUN pnpx playwright@1.32.3 install
RUN npm install -g pnpm@8.6.12 @withgraphite/graphite-cli

COPY .gitpod/xdebug.ini /etc/php/8.1/mods-available/xdebug.ini
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN /home/gitpod/.deno/bin/deno completions bash > /home/gitpod/.bashrc.d/90-deno && \
    echo 'export DENO_INSTALL="/home/gitpod/.deno"' >> /home/gitpod/.bashrc.d/90-deno && \
    echo 'export PATH="$DENO_INSTALL/bin:$PATH"' >> /home/gitpod/.bashrc.d/90-deno

# Install neovim and helpers
RUN sudo add-apt-repository ppa:neovim-ppa/unstable -y && sudo apt update
RUN sudo apt -y install neovim fd-find
RUN npm install -g neovim

RUN curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_0.40.2_Linux_x86_64.tar.gz" \
    && tar xf lazygit.tar.gz lazygit \
    && sudo install lazygit /usr/local/bin


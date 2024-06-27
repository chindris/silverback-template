#!/bin/sh

set -e

# We don't want install composer dependencies in node environments, so we check
# for composer command. But, on Platform.sh, composer exists even in nodejs
# containers.
if (command -v composer >/dev/null) && ([ -z "$PLATFORM_PROJECT" ] || [ "$PLATFORM_APPLICATION_NAME" = "cms" ]); then
  composer install
else
  echo 'Skipping composer install.'
fi

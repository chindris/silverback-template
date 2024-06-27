#!/bin/sh

set -e

if [ ! -z "$LAGOON" ] || [ ! -z "$PLATFORM_PROJECT" ]; then
  # Do not touch database on Lagoon or Platform.sh
  exit 0
fi

if ! test -f web/sites/default/files/.sqlite; then
  pnpm drupal-install
  pnpm export-webforms
fi

# In any case, re-import translation string.
pnpm import-translations
pnpm drush cr

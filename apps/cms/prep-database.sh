if [ ! -z $LAGOON ]; then
  # Do not touch database on Lagoon
  exit 0
fi

if [ ! -z $SKIP_DRUPAL_INSTALL ]; then
  exit 0
fi

set -e

if ! test -f web/sites/default/files/.sqlite; then
  pnpm drupal-install
  pnpm export-webforms
fi

# In any case, re-import translation string.
pnpm import-translations
pnpm drush cr

# On CI, run the content export and check if the export is up to date.
if [ ! -z $GITHUB_ACTIONS ]; then
  pnpm content:export
  if [[ $(git status --porcelain) ]]; then
    echo "Error: Content export is not up to date"
    echo "Please run 'pnpm content:export' from apps/cms and commit the changes"
    echo "Detected changes:"
    git status --porcelain
    echo "Diff:"
    git diff
    exit 1
  fi
fi

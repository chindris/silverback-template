if [ ! -z $LAGOON ]
then
  # Do not touch database on Lagoon
  exit 0
fi

if ! test -f web/sites/default/files/.sqlite
then
  pnpm drupal-install
else
  pnpm drush cr
fi

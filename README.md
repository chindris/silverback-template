# Silverback Template

## Install and run locally
Just run:
```
pnpm install && pnpm build
```
This should install all the needed files and a fully working Drupal CMS.

Navigate to the /apps/cms folder (in case the enviroment variable were not loaded, just run `direnv allow`) and run `drush serve` or `pnpm dev`. This should start Drupal at `localhost:8888`. The Drupal instance comes with an admin user which has the credentials: admin/admin.

@todo: document where to replace the following: COMPOSER_PROJECT_NAME, DRUPAL_HASH_SALT, PROJECT_MACHINE_NAME, PROJECT_NAME, PROD_FE_BASE_URL, PROD_FE_NETLIFY_PASSWORD, STAGE_FE_BASE_URL, STAGE_FE_NETLIFY_PASSWORD, DEV_FE_BASE_URL, DEV_FE_NETLIFY_PASSWORD

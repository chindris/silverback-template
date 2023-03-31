# Silverback Template

## Installation

Just run:

```
pnpm install && pnpm build
```

This should install all the needed files and a fully working Drupal CMS.

## CMS run

Navigate to the `apps/cms` folder (in case the enviroment variables were not
loaded, just run `direnv allow`) and then run `drush serve` or `pnpm dev`. This
should start Drupal at `localhost:8888`. The Drupal instance comes with an admin
user which has the credentials: `admin/admin`.

## Further settings

Inside the template, there are a few places where you will need to replace some
placeholder strings with the actual values for the project:

- **DRUPAL_HASH_SALT**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **PROJECT_MACHINE_NAME**: replace this in `apps/cms/composer.json`,
  `.lagoon/Dockerfile`, `apps/cms/scaffold/settings.php.append.txt`,
  `apps/cms/package.json` and `package.json`
- **PROJECT_NAME**: replace this in `apps/cms/package.json` and
  `packages/@custom-cms/custom_default_content/custom_default_content.info.yml`
- **PROD_FE_BASE_URL**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **PROD_FE_NETLIFY_PASSWORD**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **STAGE_FE_BASE_URL**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **STAGE_FE_NETLIFY_PASSWORD**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **DEV_FE_BASE_URL**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`
- **DEV_FE_NETLIFY_PASSWORD**: replace this in
  `apps/cms/scaffold/settings.php.append.txt`

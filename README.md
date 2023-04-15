# Silverback Template

## Installation

Just run:

```
pnpm i && pnpm prep
```

This should install all the needed files and prepare applications and packages.

## CMS run

Navigate to the `apps/cms` folder (in case the enviroment variables were not
loaded, just run `direnv allow`) and then run `drush serve` or `pnpm dev`. This
should start Drupal at `localhost:8888`. The Drupal instance comes with an admin
user which has the credentials: `admin/admin`.

## Environment overrides

The application is tailored to run locally out of the box. In a production or
hosting environment, you will need to override some of the environment
variables.

- **DRUPAL_HASH_SALT**: Drupal's hash salt. Should be different per environment
  for security reasons.
- **PUBLISHER_URL**: If publisher is set to a custom domain, this variable has
  to be defined.
- **NETLIFY**: To publish the project to netlify, provide the following
  environment variables:
  - NETLIFY_SITE_ID
  - NETLIFY_AUTH_TOKEN
  - NETLIFY_URL
- **[key_auth](apps/website/gatsby-config.js)** and
  **[api_key](packages/drupal/test_content/content/user/f20d961b-ba45-4820-b2cc-166e5ce56815.yml)**
- **DRUPAL_INTERNAL_URL**: The internal URL of the Drupal instance. This is used
  for the GraphQL build queries.
- **DRUPAL_EXTERNAL_URL**: The external URL of the Drupal instance. This is used
  for the GraphQL client queries.

On lagoon for example, this should happen in `.lagoon.env` files, or directly as
lagoon runtime configuration.

```shell
lagoon add variable -p [project name] -e dev -N NETLIFY_SITE_ID -V [netlify site id]
```

## Lagoon environments

In a standard project we use three fixed Lagoon environments: `dev`, `stage` and
`prod`.

- `dev`: Purely for development and integration testing. Content stored here is
  not guaranteed to be kept.
- `stage`: Used for user acceptance testing. Content is regularly synced from
  `prod`.
- `prod`: The production environment. Do not touch.

Lagoon should also be configured to create automatic environments for feature
branches that are prefixed with `lagoon/`. Those will be filled with test
content.

To configure this, execute the following command using the Lagoon CLI:

```shell
lagoon update project -p silverback-template -b "^lagoon\/|^(dev/stage/prod)$"
```

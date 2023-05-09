# Silverback Template

## Create a new project from this template

- https://github.com/AmazeeLabs/silverback-template => `Use this template` =>
  `Create a new repository`
- Clone the newly create repo
- Run `pnpx @amazeelabs/mzx run INIT.md` from the project root
- Answer its questions
- Do what it asks you to do
- Review the changes in the repo
- Commit and push
- Check the [Environment overrides](#environment-overrides) section below

## Release and deployment

Development happens in pull requests against the `dev` branch. There is a github
"Release" workflow that will merge the current state of `dev` into the `stage`.
This workflow can be triggered from the github UI and will run automatically
once a day.

The "Deploy" workflow has to be triggered manually from the github UI, and will
merge the current state of `stage` into `prod` and therefore trigger a
production deployment.

## Installation

```
pnpm i
```

## Working with apps and packages

Navigate to an app or package folder and run `pnpm turbo:dev`. Turborepo will
make sure to run all required tasks and cache as much as it can.

### Turborepo setup

We try to follow common rules in all apps and packages.

Usually, the following scripts can be found in `package.json`:

- `prep`: Prepare everything related to code. For example, compile code,
  generate types, download additional dependencies, etc.
- `build`: Build the app or package. For example, setup Drupal, build Gatsby,
  build Storybook, etc.

If there is a `turbo:` prefixed script, it will run the non prefixed script and
additionally

- Run all required scripts in this or other packages
- Cache the results if possible

For example, running `pnpm turbo:dev` in `apps/website` will prepare all
dependencies, setup and start Drupal, start Publisher and open the Publisher's
status URL in the browser.

### Drupal

Considering the above, please note that the Drupal database can be reset on

- re-running `pnpm turbo:dev` in `apps/cms`
- running some `turbo:` prefixed scripts in `apps/website`

If you have some unsaved work in the Drupal database, don't start Drupal with
`pnpm turbo:dev` but use `pnpm dev` instead.

## Environment overrides

The application is tailored to run locally out of the box. In a production or
hosting environment, you will need to override some of the environment
variables.

- **DRUPAL_HASH_SALT** (lagoon): Drupal's hash salt. Should be different per
  environment for security reasons.
- **PUBLISHER_URL** (lagoon): If publisher is set to a custom domain, this
  variable has to be defined.
- **NETLIFY**: To publish the project to netlify, provide the following
  environment variables:
  - **NETLIFY_SITE_ID** (lagoon): The ID of the netlify project the
  - **NETLIFY_AUTH_TOKEN** (lagoon): The auth token for the netlify project.
  - **NETLIFY_URL** (lagoon): The URL of the netlify project.
  - **NETLIFY_STORYBOOK_ID** (github): If this is set, the UI packages storybook
    build will be published to netlify.
- **CLOUDINARY**: To use cloudinary for image processing, provide the following
  environment variables:
  - **CLOUDINARY_CLOUDNAME** (lagoon): The cloud name of the cloudinary project.
  - **CLOUDINARY_API_KEY** (lagoon): The API key of the cloudinary project.
  - **CLOUDINARY_API_SECRET** (lagoon): The API secret of the cloudinary
    project.
- **DRUPAL_INTERNAL_URL** (lagoon): The internal URL of the Drupal instance.
  This is used for the GraphQL build queries.
- **DRUPAL_EXTERNAL_URL** (lagoon): The external URL of the Drupal instance.
  This is used for the GraphQL client queries.

On lagoon for example, this should happen in `.lagoon.env` files, or directly as
lagoon runtime configuration.

```shell
lagoon add variable -p [project name] -e dev -N NETLIFY_SITE_ID -V [netlify site id]
```

## Storybook

If a `CHROMATIC_PROJECT_TOKEN` environment variable is set, the Storybook build
will be published to [Chromatic](https://www.chromatic.com/). Additionally
setting the `NETLIFY_STORYBOOK_ID` environment variable will deploy storybook to
netlify, which provides less features but is easier to access.

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

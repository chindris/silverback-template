# Silverback Template

## Create a new project from this template

- https://github.com/AmazeeLabs/silverback-template => `Use this template` =>
  `Create a new repository`
- In the newly created repo
  - Settings > Manage access > Collaborators and teams
    - add `Tech Team` with `Admin` role
    - remove yourself
  - Settings > General > Pull Requests
    - Disable `Allow merge commits`
    - Enable `Automatically delete head branches`
- Clone the newly create repo
- Run `pnpx @amazeelabs/mzx run INIT.md` from the project root
- Answer its questions
- Review the changes in the repo
- Commit and push
- [Create a new Lagoon project](https://amazeelabs.atlassian.net/wiki/spaces/ALU/pages/368115717/Create+a+new+Lagoon+project)
- [Create a new Netlify project](https://amazeelabs.atlassian.net/wiki/spaces/ALU/pages/368017428/Create+a+new+Netlify+project)
- Check the [Environment overrides](#environment-overrides) section below

## Branches and environments

<table>
<thead>
  <tr>
    <th rowspan="2">Branch name</th>
    <th rowspan="2">Connected environment</th>
    <th colspan="2">Purpose </th>
  </tr>
  <tr>
    <th>Pre Go Live</th>
    <th>Post Go Live</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>release</code></td>
    <td>(none)</td>
    <td colspan="2">Contains everything that is approved for PROD deployment</td>
  </tr>
  <tr>
    <td><code>prod</code></td>
    <td>PROD</td>
    <td colspan="2">The production environment</td>
  </tr>
  <tr>
    <td><code>dev</code></td>
    <td>DEV</td>
    <td>Sandbox/playground, no client data, anyone can merge anything</td>
    <td>Sandbox/playground, with client data, main testing environment</td>
  </tr>
  <tr>
    <td><code>stage</code></td>
    <td>STAGE</td>
    <td>Second sandbox with client data and automated merge from <code>dev</code> to <code>stage</code>, regular data sync</td>
    <td>Second sandbox for bigger features that need a clean set up or would prevent other normal tasks from being performed while working on it. With client data. No automated merges from <code>dev</code>.</td>
  </tr>
  <tr>
    <td><code>lagoon-*</code></td>
    <td>(same as branch name)</td>
    <td colspan="2">Can be created for big, long-term feature developments. Use wisely<br>  as it creates additional costs.</td>
  </tr>
</tbody>
</table>

## Development workflow

- Create a new branch from `release` and commit your work in
- Create a PR against `release`
- Merge your branch to `dev` for testing
- Testing feedback is committed to the branch and merged back to `dev` for
  retesting
- When the PR is approved and Jira ticket gets to the Deploy state, the branch
  is merged to `release`
  - Please note, this does not trigger an actual PROD deployment
- PROD deployment can be done by merging `release` branch into `prod`

## Installation

```
pnpm i
```

Additionally, you can run `pnpm turbo:test`. This will serve two purposes:

- It will make sure that your system is fully compatible with the project
- It will generate code that is required for IDE autocompletion

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

### Layout images

These are images that are part of the design and are therefore not uploaded by
the user. They have to be put into the `static/public` directory which is also
shared with the website application (Gatsby). Examples are logos, icons, etc. In
a component they should be rendered with a regular `<img>` tag and the `src`
relative to the `static/public` directory.

```tsx
<img src="/logo.svg" alt="Logo" />
```

### Content images

These are images that are uploaded by the user, or on some other way injected
from the outside. In production, images are handled by Cloudinary. In
development, basic cropping is simulated in the browser. The location to store
these images is the `static/stories` directory, which is used for Storybook
only.

In the GraphQL schema, these images are represented by the `ImageSource` type.
If the component requires ones of these, one should use the `image` helper from
`src/helpers/image`, which produces exactly this type. The image itself can be
imported from the `static/stories` directory using the `@stories/` alias. The
import is handled by
[`vite-imagetools`](https://github.com/JonasKruckenberg/imagetools/tree/main/packages/vite)
and has to end with `as=metadata`. It is also possible to apply transformations.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage),
  },
} satisfied StoryObj<typeof Teaser>
```

In this case, the image will retain its intrinsinc dimensions. To simulate
scaling, pass a `width` property.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400 }),
  },
} satisfied StoryObj<typeof Teaser>
```

The image will retain its aspect ratio. To actually crop the image, also add a
`height`.

```tsx
import Teaser from './Teaser';
import TeaserImage from '@stories/teaser.jpg?as=metadata';

export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400, height: 300 }),
  },
} satisfied StoryObj<typeof Teaser>
```

### Responsive images

In GraphQL fragments, it is possible to request responsive image sources.

```gql
fragment Teaser on Page {
  title
  image(width: 400, height: 300, sizes: [[1200, 800]])
}
```

The output of `image` is also of type `ImageSource`. To simulate this in
Storybook, add the same `sizes` property to the `image` helper.

```tsx
export const WithImage = {
  args: {
    title: 'Lorem ipsum dolor sit amet',
    image: image(TeaserImage, { width: 400, height: 300, sizes: [[1200, 800]]}),
  },
} satisfied StoryObj<typeof Teaser>
```

> **IMPORTANT:** If embedded this way, these images will not be visible in
> Storybook immediately. Instead, a placeholder that indicates the loaded images
> dimensions will be shown.

An approximation of the image that would be delivered by Cloudinary is embedded
when:

- On "demo" storybook builds deployed to netlify
- In Gatsby when built on Lagoon.

These Cloudinary approximations are not real images and will fail integration
tests. Therefore they are not used in regular development and testing scenarios.

## "Strangling" legacy systems

The template includes a Netlify Edge Function
(`apps/website/netlify/edge-functions/strangler.ts`) that allows to proxy
unknown requests selectively to other systems. This can be used to replace only
specific pages of a legacy system or incorporate existing business logic.

Refer to the
[Strangler Pattern](https://www.martinfowler.com/bliki/StranglerFigApplication.html)
blog post if you wonder where the name comes from, to
[Edge functions documentation](https://docs.netlify.com/edge-functions/overview/)
for technical details and to `strangler.ts` for how to add new legacy systems.

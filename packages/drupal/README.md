## Overview

This is a home for all custom Drupal modules.

This directory (`packages/drupal`) is symlinked to
`apps/cms/web/modules/custom`.

If we need custom Drupal themes, we might create `packages/drupal_themes`
directory and link it in a similar way.

## Rules

Each Drupal module should have a `package.json` file. Minimal contents:

```json
{
  "name": "@custom/<MODULE_NAME>",
  "version": "1.0.0",
  "private": true
}
```

Each module should be declared as a dependency of the `apps/cms` package.

## How it works in general

Turborepo allows to cache results for scripts from `package.json` files.

Minimal example:

- The `build` script compiles files from `src` folder and puts the result into
  `dist` folder
- We can setup a Turborepo pipeline
  ```json
  "build": {
    "inputs": ["src/**"],
    "outputs": ["dist/**"]
  }
  ```
- On the first `turbo build` run Turborepo will
  - calculate hashes for files from `src` folder, and save them into cache,
  - save `dist` folder into cache.
- On the second `turbo build` run Turborepo will compare `src` hashes with
  cache. If hashes do match, it will restore `dist` folder from the cache
  without running the `build` script.

More in docs: https://turbo.build/repo/docs/core-concepts/caching

## Turborepo setup: local vs CI

Locally, Turborepo stores caches in `.turbo` folder.

In CI, the caches are saved in Github artifacts.

## Debug Turborepo issues in CI

It can happen that some script fails in CI because of a misconfigured Turborepo
pipeline. The following can be used in order to debug this locally:

- Setup https://github.com/ducktors/turborepo-remote-cache locally
- Run `turborepo-remote-cache` with `TURBO_TOKEN=local pnpm dev`
- Run tests in the target repo with

  ```shell
  # Clean the repo
  devbox run clean
  # Install dependencies
  pnpm i
  # Run tests with
  # - local Turborepo server
  # - Turborepo debug info
  # - simulated CI
  TURBO_API=http://0.0.0.0:3000 TURBO_TOKEN=local TURBO_TEAM=local TURBO_RUN_SUMMARY=true CI=true pnpm turbo:test
  ```

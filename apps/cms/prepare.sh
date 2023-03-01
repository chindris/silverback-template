#!/usr/bin/env bash

if [[ -z $LAGOON ]] && php -v
then
  set -ex
  composer install
  export SB_SETUP=1
  pnpm run setup
  pnpm snapshot-create
  pnpm schema:export
fi

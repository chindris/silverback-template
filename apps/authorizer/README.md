# OpenAuth Authorizer

OpenAuth authorizer with a Drupal adapter.

It listens to these routes

- `/authorize`
- `/drupal/callback`

## Local setup

Create a Drupal `website` consumer

- Client id: `website`
- Client secret: `website`
- Redirect URI: `http://localhost:3000/drupal/callback`

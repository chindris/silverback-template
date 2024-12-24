# OpenAuth Authorizer

OpenAuth authorizer with a Drupal adapter.

It listens to these routes

- `/authorize`
- `/drupal/callback`

## Local setup

Start the authorizer.

### Drupal

Create a `website` consumer

- Client id: `website`
- Client secret: `website`
- Redirect URI: `http://localhost:3000/drupal/callback`

### Client

In the frontend (example: React)

```typescript
import { createClient } from '@openauthjs/openauth/client';

const client = createClient({
  clientID: 'website',
  issuer: 'http://localhost:3000',
});
```

import { defineConfig } from '@amazeelabs/publisher';

const isNetlifyEnabled =
  !!process.env.NETLIFY_SITE_ID && !!process.env.NETLIFY_AUTH_TOKEN;
const isLagoon = !!process.env.LAGOON;

export default defineConfig({
  commands: {
    build: {
      command: isNetlifyEnabled
        ? 'pnpm build:waku'
        : 'DRUPAL_EXTERNAL_URL=http://127.0.0.1:8888 pnpm build:waku',
      outputTimeout: 1000 * 60 * 10,
    },
    clean: 'pnpm clean',
    // Serve only on non Lagoon environments.
    serve: !isLagoon
      ? {
          command: 'pnpm netlify dev --cwd=. --dir=public --port=7999',
          readyPattern: 'Server now ready',
          readyTimeout: 1000 * 60,
          port: 7999,
        }
      : undefined,
    deploy: isNetlifyEnabled
      ? [
          `pnpm netlify env:set AWS_LAMBDA_JS_RUNTIME nodejs18.x`,
          `pnpm netlify env:set DRUPAL_EXTERNAL_URL ${process.env.DRUPAL_EXTERNAL_URL}`,
          `pnpm netlify deploy --cwd=. --dir=dist/public --prodIfUnlocked`,
        ].join(' && ')
      : 'echo "Fake deployment done"',
  },
  databaseUrl: '/tmp/publisher.sqlite',
  publisherPort: isLagoon ? 3000 : 8000,
  oAuth2: isLagoon
    ? {
        clientId: process.env.PUBLISHER_OAUTH2_CLIENT_ID || 'publisher',
        clientSecret: process.env.PUBLISHER_OAUTH2_CLIENT_SECRET || 'publisher',
        sessionSecret: process.env.PUBLISHER_OAUTH2_SESSION_SECRET || 'banana',
        tokenHost:
          process.env.PUBLISHER_OAUTH2_TOKEN_HOST || 'http://127.0.0.1:8888',
        environmentType:
          process.env.PUBLISHER_OAUTH2_ENVIRONMENT_TYPE || 'development',
        scope: 'publisher',
        tokenPath: '/oauth/token',
        authorizePath: '/oauth/authorize?response_type=code',
        grantType: 0,
      }
    : undefined,
});

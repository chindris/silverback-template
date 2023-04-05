import { defineConfig } from '@amazeelabs/publisher';

const isNetlifyEnabled =
  !!process.env.NETLIFY_SITE_ID && !!process.env.NETLIFY_AUTH_TOKEN;
const isLagoon = !!process.env.LAGOON;

export default defineConfig({
  commands: {
    build: {
      command: 'pnpm build',
      outputTimeout: 1000 * 60 * 10,
    },
    clean: 'pnpm clean',
    serve: {
      command: 'pnpm netlify dev --dir=public --port=7999',
      readyPattern: 'Server now ready',
      readyTimeout: 1000 * 60,
      port: 7999,
    },
    deploy: isNetlifyEnabled
      ? 'pnpm netlify deploy --dir=public --prod'
      : 'echo "Fake deployment done"',
  },
  persistentBuilds: {
    buildPaths: ['.cache', 'public'],
    saveTo: 'persisted-store/saved-builds',
  },
  databaseUrl: 'persisted-store/publisher.sqlite',
  publisherPort: isLagoon ? 3000 : 8000,
});

import { defineConfig } from '@amazeelabs/publisher';

const isLagoon = !!process.env.LAGOON;

export default defineConfig({
  commands: {
    build: {
      command: 'exit 1',
      outputTimeout: 1000 * 60 * 10,
    },
    clean: 'exit 1',
    serve: {
      command: 'exit 1',
      readyPattern: 'Server now ready',
      readyTimeout: 1000 * 60,
      port: 7999,
    },
    deploy: 'echo "Fake deployment done"',
  },
  databaseUrl: '/tmp/publisher.sqlite',
  publisherPort: isLagoon ? 3000 : 8000,
});

import { defineConfig, frontend } from '@custom/eslint-config';

export default defineConfig([
  ...frontend,
  {
    ignores: [
      'build/**',
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
      'static/stories/webforms/**',
      'vite.config.ts.**',
    ],
  },
]);

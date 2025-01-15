import { defineConfig, frontend } from '@custom/eslint-config';

export default defineConfig([
  ...frontend,
  {
    ignores: ['build/**', 'dist/**', 'vite.config.ts.**'],
  },
]);

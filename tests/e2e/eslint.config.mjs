import { base, defineConfig } from '@custom/eslint-config';

export default defineConfig([
  ...base,
  {
    ignores: [
      'src/generated/**',
      'build/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
]);

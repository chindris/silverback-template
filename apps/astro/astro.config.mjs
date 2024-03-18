import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@amazeelabs/bridge': path.resolve(
          'node_modules/@amazeelabs/bridge-astro/build/src/index.js',
        ),
      },
    },
  },
});

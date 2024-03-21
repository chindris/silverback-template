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
        // AXXX Vite treats monorepo dependencies as source code and bundles
        //  them. But once we "pnpm deploy" the app, they are not bundled, our
        //  @custom/schema package is loaded as is, and it imports
        //  @amazeelabs/bridge. So no replacement to @amazeelabs/bridge-astro
        //  happens.
        //  This workaround tricks Vite into treating the listed dependencies as
        //  source code.
        '@custom/ui': path.resolve('node_modules/@custom/ui/build/components'),
        '@custom/schema': path.resolve('node_modules/@custom/schema/build'),
      },
    },
  },
});

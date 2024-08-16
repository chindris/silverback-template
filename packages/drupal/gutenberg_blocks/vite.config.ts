import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'gutenberg_blocks',
      fileName: 'gutenberg_blocks',
    },
    rollupOptions: {
      strictDeprecations: true,
      external: [
        'react',
        'react-dom',
        'wordpress__blocks',
        'wordpress__block-editor',
        'wordpress__components',
        'wordpress__compose',
        'wordpress__data',
        'wordpress__editor',
        'wordpress__element',
        'wordpress__hooks',
      ],
      output: {
        strict: true,
        globals: {
          react: 'React',
          wordpress__blocks: 'wp.blocks',
          'wordpress__block-editor': 'wp.blockEditor',
          wordpress__components: 'wp.components',
          wordpress__compose: 'wp.compose',
          wordpress__data: 'wp.data',
          wordpress__editor: 'wp.editor',
          wordpress__element: 'wp.element',
          wordpress__hooks: 'wp.hooks',
        },
      },
    },
    outDir: resolve(__dirname, './js'),
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
      exclude: ['react', 'react-dom'],
    }),
  ],
});

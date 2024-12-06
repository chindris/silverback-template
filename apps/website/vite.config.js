import path from 'path';

export default {
  resolve: {
    alias: {
      '@amazeelabs/bridge': path.resolve(__dirname, 'src/bridge.tsx'),
      fs: 'node:fs',
    },
    // Make sure there is always only one version of react.
    // Useful to avoid context errors when react is added by dependencies and
    // bundled multiple times.
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    external: ['sharp', 'image-dimensions'],
  },
  optimizeDeps: {
    exclude: ['sharp', 'image-dimensions'],
  },
};

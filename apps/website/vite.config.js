import path from 'path';

export default {
  resolve: {
    alias: {
      '@amazeelabs/bridge': path.resolve(__dirname, 'src/bridge.tsx'),
      'fs': 'node:fs'
    },
  },
};

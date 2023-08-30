import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  outDir: 'build',
  clean: true,
});

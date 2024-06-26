import { readdirSync, writeFileSync } from 'fs';

writeFileSync(
  'build/preloaded-fonts.json',
  JSON.stringify(
    readdirSync(`static/public/fonts/preload`).map((font) => {
      return `/fonts/preload/${font}`;
    }),
  ),
);

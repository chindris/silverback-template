import { readdirSync } from 'fs';

export const fonts = readdirSync('./static/public/fonts/preload').map(
  (font) => {
    return `/fonts/preload/${font}`;
  },
);

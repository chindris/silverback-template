import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig, UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { resolve, dirname } from 'path';

import { readdirSync } from 'fs';

const fonts = readdirSync(`static/public/fonts/preload`).map((font) => {
  return `/fonts/preload/${font}`;
});

const config: StorybookConfig = {
  viteFinal: (config, { configType }) =>
    mergeConfig(config, {
      css: {
        postcss: 'src',
      },
      resolve: {
        alias: {
          '@amazeelabs/bridge': '@amazeelabs/bridge-storybook',
          '@stories': resolve(
            dirname(new URL(import.meta.url).pathname),
            '../static/stories',
          ),
        },
      },
      plugins: [imagetools()],
    } satisfies UserConfig),
  staticDirs: ['../static/public', '../static/stories'],
  stories: ['../src/**/*.@(mdx|stories.@(ts|tsx))'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  previewHead: (head) => `
    ${head}
    ${fonts
      .map(
        (font: string) =>
          `<link rel="preload" href="${font}" as="font" type="font/woff2" crossOrigin="anonymous" />`,
      )
      .join('\n')}
  `,
};
export default config;

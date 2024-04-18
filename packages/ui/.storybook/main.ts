import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig, UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { resolve, dirname } from 'path';

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
};
export default config;

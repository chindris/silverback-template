import type { StorybookConfig } from '@storybook/react-vite';
import pluginTurbosnap from 'vite-plugin-turbosnap';
import { mergeConfig, UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

const config: StorybookConfig = {
  viteFinal: (config, { configType }) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@amazeelabs/bridge': '@amazeelabs/bridge-storybook',
        },
      },
      plugins: [
        pluginTurbosnap({ rootDir: config.root ?? process.cwd() }),
        imagetools(),
      ],
    } satisfies UserConfig),
  staticDirs: ['../static/public', '../static/stories'],
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
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

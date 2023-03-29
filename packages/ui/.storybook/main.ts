import type { StorybookConfig } from '@storybook/react-vite';
import pluginTurbosnap from 'vite-plugin-turbosnap';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  viteFinal: (config, { configType }) =>
    mergeConfig(config, {
      plugins:
        configType === 'PRODUCTION'
          ? [pluginTurbosnap({ rootDir: config.root ?? process.cwd() })]
          : [],
    }),
  staticDirs: ['../static/public', '../static/stories'],
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
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

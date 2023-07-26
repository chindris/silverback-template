import CMS from 'netlify-cms-app';

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/data',
    backend: import.meta.env.DEV
      ? {
          name: 'test-repo',
        }
      : {
          name: 'git-gateway',
          branch: 'dev',
        },
    i18n: {
      structure: 'multiple_folders',
      locales: ['en', 'de'],
      default_locale: 'en',
    },
    collections: [
      {
        label: 'Settings',
        description: 'Global settings that might appear on every page.',
        name: 'settings',
        i18n: {
          locales: ['en', 'de'],
          structure: 'single_file',
        },
        files: [],
      },
    ],
  },
});

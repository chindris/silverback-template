import CMS from 'netlify-cms-app';
import { CmsCollection } from 'netlify-cms-core';

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/media',
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
      {
        label: 'Contact',
        description: 'Contact description',
        name: 'contact',
        i18n: {
          locales: ['en', 'de'],
          structure: 'single_file',
        },
        create: true,
        folder: 'apps/decap/data/contact',
        format: 'yml',
        identifier_field: 'name',
        summary: '{{name}}',
        fields: [
          {
            label: 'Name',
            name: 'name',
            widget: 'string',
          },
          // {
          //   label: 'Portrait',
          //   name: 'portrait',
          //   widget: 'image',
          //   required: false,
          // },
        ],
      } satisfies CmsCollection,
    ],
  },
});

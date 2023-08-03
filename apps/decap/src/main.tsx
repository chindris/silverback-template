import CMS from 'netlify-cms-app';
import { CmsCollection, CmsField } from 'netlify-cms-core';

import { UuidWidget } from './uuid';

CMS.registerWidget('uuid', UuidWidget);

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/media',
    backend: import.meta.env.DEV
      ? {
          name: 'test-repo',
        }
      : window.location.hostname === 'localhost'
      ? {
          name: 'proxy',
          proxy_url: 'http://localhost:8081/api/v1',
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
            label: 'ID',
            name: 'id',
            widget: 'uuid',
          } as CmsField,
          {
            label: 'Name',
            name: 'name',
            widget: 'string',
            required: true,
          },
          {
            label: 'Position',
            name: 'position',
            widget: 'string',
            required: true,
          },
          {
            label: 'E-Mail',
            name: 'email',
            widget: 'string',
            required: true,
          },
          {
            label: 'Phone',
            name: 'phone',
            widget: 'string',
            required: false,
          },
          {
            label: 'Portrait',
            name: 'portrait',
            widget: 'image',
            required: false,
          },
        ],
      } satisfies CmsCollection,
    ],
  },
});

import CMS from 'netlify-cms-app';

import css from '../node_modules/@custom/ui/build/styles.css?raw';
import { PageCollection, PagePreview } from './collections/page';
import { UuidWidget } from './helpers/uuid';

CMS.registerPreviewStyle(css, { raw: true });
CMS.registerWidget('uuid', UuidWidget);

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/media',
    backend: import.meta.env.DEV
      ? // In development, use the in-memory backend.
        {
          name: 'test-repo',
        }
      : window.location.hostname === 'localhost'
      ? // On localhost, use the proxy backend.
        {
          name: 'proxy',
          proxy_url: 'http://localhost:8081/api/v1',
        }
      : // Otherwise, its production. Use the Git Gateway backend.
        {
          name: 'git-gateway',
          branch: 'dev',
        },
    i18n: {
      structure: 'single_file',
      locales: ['en', 'de'],
      default_locale: 'en',
    },
    collections: [
      {
        label: 'Settings',
        description: 'Global settings that might appear on every page.',
        name: 'settings',
        files: [
          {
            label: 'Site',
            name: 'site',
            file: 'apps/decap/data/site.yml',
            fields: [
              {
                label: 'Homepage',
                name: 'homePage',
                widget: 'relation',
                collection: 'page',
                search_fields: ['title'],
                value_field: 'path',
              },
              {
                label: '404 Page',
                name: 'notFoundPage',
                widget: 'relation',
                collection: 'page',
                search_fields: ['title'],
                value_field: 'path',
              },
            ],
          },
        ],
      },
      PageCollection,
    ],
  },
});

CMS.registerPreviewTemplate('page', PagePreview);

import { PreviewPageQuery } from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import CMS from 'netlify-cms-app';

import css from '../node_modules/@custom/ui/build/styles.css?raw';
import { PageCollection, pageSchema } from './collections/page';
import { createPreview } from './helpers/preview';
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
                label: 'Contact e-Mail',
                name: 'email',
                widget: 'string',
              },
            ],
          },
        ],
      },
      PageCollection,
    ],
  },
});

CMS.registerPreviewTemplate(
  'page',
  createPreview(
    PreviewPageQuery,
    pageSchema,
    ({ preview }) => <Page page={preview} />,
    'previewPage',
  ),
);

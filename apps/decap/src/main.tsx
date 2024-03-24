import { TokenAuthBackend } from '@amazeelabs/decap-cms-backend-token-auth/backend';
import {
  Locale,
  PreviewDecapPageQuery,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import CMS from 'decap-cms-app';

import css from '../node_modules/@custom/ui/build/styles.css?raw';
import { PageCollection, pageSchema } from './collections/page';
import { Translatables } from './collections/translatables';
import { createPreview } from './helpers/preview';
import { UuidWidget } from './helpers/uuid';

const locales = Object.values(Locale);
const default_locale = locales.includes('en') ? 'en' : locales[0];

CMS.registerPreviewStyle(css, { raw: true });
CMS.registerWidget('uuid', UuidWidget);
CMS.registerBackend('token-auth', TokenAuthBackend);

CMS.init({
  config: {
    publish_mode: 'simple',
    media_folder: 'apps/decap/media',
    // @ts-ignore
    backend: import.meta.env.DEV
      ? {
          // In development, use the in-memory backend.
          name: 'test-repo',
        }
      : window.location.hostname === 'localhost'
        ? {
            // On localhost, use the proxy backend that writes to files.
            name: 'proxy',
            proxy_url: 'http://localhost:8081/api/v1',
          }
        : {
            // Otherwise, its production. Use the token auth backend.
            name: 'token-auth',
            api_root: '/.netlify/functions/github-proxy',
            repo: 'AmazeeLabs/silverback-template',
            branch: 'prod',
          },
    i18n: {
      structure: 'single_file',
      locales,
      default_locale,
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
      Translatables,
      PageCollection,
    ],
  },
});

CMS.registerPreviewTemplate(
  'page',
  createPreview(
    PreviewDecapPageQuery,
    pageSchema,
    (data) => {
      registerExecutor(ViewPageQuery, { page: data.preview });
      return <Page />;
    },
    'previewDecapPage',
  ),
);

import { TokenAuthBackend } from '@amazeelabs/decap-cms-backend-token-auth/backend';
import {
  Locale,
  OperationExecutorsProvider,
  PreviewDecapPageQuery,
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

if (
  window.location.hostname !== 'localhost' &&
  !import.meta.env.DEV &&
  (!import.meta.env.VITE_DECAP_REPO || !import.meta.env.VITE_DECAP_BRANCH)
) {
  console.error(
    "VITE_DECAP_REPO and VITE_DECAP_BRANCH environment variables are missing. Can't connect to the repository.",
  );
}

CMS.init({
  config: {
    load_config_file: false,
    publish_mode: 'editorial_workflow',
    media_folder: 'apps/decap/media',
    // @ts-ignore
    backend: import.meta.env.DEV
      ? {
          // In development, use the in-memory backend.
          name: 'test-repo',
        }
      : window.location.hostname === 'localhost' ||
          !import.meta.env.VITE_DECAP_REPO ||
          !import.meta.env.VITE_DECAP_BRANCH
        ? {
            // On localhost, use the proxy backend that writes to files.
            name: 'proxy',
            proxy_url: 'http://localhost:8081/api/v1',
          }
        : {
            // Otherwise, its production. Use the token auth backend.
            name: 'token-auth',
            api_root: '/.netlify/functions/github-proxy',
            repo: import.meta.env.VITE_DECAP_REPO,
            branch: import.meta.env.VITE_DECAP_BRANCH,
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
      return (
        <OperationExecutorsProvider
          executors={[{ executor: data.preview, id: ViewPageQuery }]}
        >
          <Page />
        </OperationExecutorsProvider>
      );
    },
    'previewDecapPage',
  ),
);

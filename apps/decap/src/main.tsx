import { ImageSource, Markup, PreviewPageQuery, Url } from '@custom/schema';
import {
  ContactSource,
  NavigationItemSource,
  PageSource,
} from '@custom/schema/source';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { Page as PageComponent } from '@custom/ui/routes/Page';
import CMS from 'netlify-cms-app';
import { CmsCollection, CmsField } from 'netlify-cms-core';
import { z, ZodType, ZodTypeDef } from 'zod';

import css from '../node_modules/@custom/ui/build/styles.css?raw';
import { useQuery } from './query';
import { UuidWidget } from './uuid';

CMS.registerPreviewStyle(css, { raw: true });
CMS.registerWidget('uuid', UuidWidget);

const menuItems = (amount: number) =>
  [...Array(amount).keys()].map(
    (i) =>
      ({
        id: `${i}`,
        __typename: 'NavigationItem',
        title: `Item ${i + 1}`,
        target: '/' as Url,
      } satisfies NavigationItemSource),
  );

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
        i18n: true,
        files: [],
      },
      {
        label: 'Contact',
        description: 'Contact description',
        name: 'contact',
        i18n: true,
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
            label: 'Role',
            name: 'role',
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

function createTransformer<T extends any>(
  schema: ZodType<T, ZodTypeDef, unknown>,
) {
  return function (input: any, fallback?: T) {
    const result = schema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      return fallback;
    }
  };
}

const contactTransformer = createTransformer<ContactSource>(
  z.object({
    __typename: z.literal('Contact').optional().default('Contact'),
    id: z.string(),
    name: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    portrait: z
      .string()
      .optional()
      .transform((src) => src as ImageSource),
  }),
);

CMS.registerPreviewTemplate('contact', ({ entry, getAsset }) => {
  const input = entry.toJS().data;
  const contact = contactTransformer(input, {
    __typename: 'Contact',
    id: '[id]',
    name: '[name]',
    role: '[role]',
    email: '[email]',
  });
  const data = useQuery(
    PreviewPageQuery,
    {
      previewPage: {
        __typename: 'Page',
        title: 'Test',
        locale: 'en',
        path: '/test' as Url,
        hero: {
          __typename: 'Hero',
          headline: 'Contact preview',
        },
        content: [
          {
            __typename: 'BlockMarkup',
            markup:
              '<p>This is a test page to preview a contact item.</p>' as Markup,
          },
        ],
        contacts: [contact],
      },
    } satisfies {
      previewPage: PageSource;
    },
    {
      id: '',
      locale: 'en',
      rid: '',
    },
    (src) => getAsset(src).url,
  );

  return (
    <IntlProvider locale={'en'}>
      <Frame
        header={{
          mainNavigation: {
            items: menuItems(4),
          },
        }}
        footer={{
          footerNavigation: {
            items: menuItems(4),
          },
        }}
      >
        {data?.previewPage ? <PageComponent page={data.previewPage} /> : null}
      </Frame>
      <script
        type="text/javascript"
        src="/mock-cloudinary-register.js"
      ></script>
    </IntlProvider>
  );
});

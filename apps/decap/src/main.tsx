import { ImageSource, Markup, PreviewPageQuery, Url } from '@custom/schema';
import {
  BlockMarkupSource,
  BlockMediaSource,
  LocaleSource,
  MediaImageSource,
  NavigationItemSource,
  PageSource,
} from '@custom/schema/source';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { Page as PageComponent } from '@custom/ui/routes/Page';
import CMS from 'netlify-cms-app';
import { CmsCollection, CmsField } from 'netlify-cms-core';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
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
      {
        label: 'Page',
        description: 'Content pages',
        name: 'page',
        i18n: true,
        create: true,
        folder: 'apps/decap/data/page',
        format: 'yml',
        identifier_field: 'title',
        summary: '{{title}}',
        fields: [
          {
            label: 'ID',
            name: 'id',
            widget: 'uuid',
          } as CmsField,
          {
            label: 'Path',
            name: 'path',
            widget: 'string',
            comment: 'The path of the page. Must be unique.',
            required: true,
            i18n: true,
          },
          {
            label: 'Title',
            name: 'title',
            widget: 'string',
            required: true,
            i18n: true,
          },
          {
            label: 'Teaser image',
            name: 'teaserImage',
            widget: 'image',
            required: false,
            i18n: true,
          },
          {
            label: 'Hero',
            name: 'hero',
            widget: 'object',
            collapsed: false,
            fields: [
              {
                label: 'Headline',
                name: 'headline',
                widget: 'string',
                required: true,
                i18n: true,
              },
              {
                label: 'Lead',
                name: 'lead',
                widget: 'string',
                required: true,
                i18n: true,
              },

              {
                label: 'Hero image',
                name: 'image',
                widget: 'image',
                required: true,
                i18n: true,
              },
            ],
          },
          {
            label: 'Content',
            name: 'content',
            widget: 'list',
            i18n: true,
            types: [
              {
                label: 'Text',
                name: 'text',
                widget: 'object',
                fields: [
                  {
                    label: 'Text',
                    name: 'text',
                    widget: 'markdown',
                  },
                ],
              },
              {
                label: 'Image',
                name: 'image',
                widget: 'object',
                fields: [
                  {
                    label: 'Image',
                    name: 'image',
                    widget: 'image',
                  },
                  {
                    label: 'Alt text',
                    name: 'alt',
                    widget: 'string',
                  },
                  {
                    label: 'Caption',
                    name: 'caption',
                    widget: 'markdown',
                  },
                ],
              },
            ],
          },
        ],
      } satisfies CmsCollection,
    ],
  },
});

function createTransformer<T extends any>(
  schema: ZodType<T, ZodTypeDef, unknown>,
) {
  return function (input: any, fallback: T) {
    const result = schema.safeParse(input);
    if (result.success) {
      return result.data;
    } else {
      console.debug(result);
      return fallback;
    }
  };
}

const transformMarkdown = z
  .string()
  .optional()
  .transform(
    (t) =>
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .processSync(t)
        .toString() as Markup,
  );

const BlockMarkupSchema: ZodType<BlockMarkupSource, ZodTypeDef, unknown> = z
  .object({
    type: z.literal('text'),
    text: transformMarkdown,
  })
  .transform(({ text }) => {
    return {
      __typename: 'BlockMarkup',
      markup: text,
    };
  });

const BlockMediaImageSchema: ZodType<BlockMediaSource, ZodTypeDef, unknown> = z
  .object({
    type: z.literal('image'),
    alt: z.string(),
    image: z.string(),
    caption: transformMarkdown,
  })
  .transform(({ image, alt, caption }) => {
    return {
      __typename: 'BlockMedia',
      media: {
        __typename: 'MediaImage',
        source: image as ImageSource,
        alt,
      },
      caption: caption,
    };
  });

const pageSchema = z.object({
  __typename: z.literal('Page').optional().default('Page'),
  id: z.string(),
  title: z.string(),
  locale: z.string().transform((l) => l as LocaleSource),
  path: z.string().transform((p) => p as Url),
  hero: z.object({
    __typename: z.literal('Hero').optional().default('Hero'),
    headline: z.string(),
    lead: z.string().optional(),
    image: z
      .string()
      .optional()
      .transform((s) => s as ImageSource)
      .transform(
        (source) =>
          ({
            __typename: 'MediaImage',
            source,
            alt: '',
          } satisfies MediaImageSource),
      ),
  }),
  content: z.array(z.union([BlockMarkupSchema, BlockMediaImageSchema])),
});

const pageTransformer = createTransformer<PageSource>(pageSchema);

CMS.registerPreviewTemplate('page', ({ entry, getAsset }) => {
  const input = entry.toJS().data;
  console.log(input);
  const previewPage = pageTransformer(
    { ...input, locale: 'en' },
    {
      __typename: 'Page',
      id: '[id]',
      title: 'title',
      locale: 'en',
      path: '/preview' as Url,
    },
  );
  const data = useQuery(
    PreviewPageQuery,
    {
      previewPage,
    } satisfies PreviewPageQuery,
    {
      id: '',
      locale: 'en',
      rid: '',
    },
    (src) => getAsset(src).url,
  );
  console.log(data);

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

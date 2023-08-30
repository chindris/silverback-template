import { ImageSource, PreviewPageQuery, Url } from '@custom/schema';
import {
  BlockMarkupSource,
  BlockMediaSource,
  LocaleSource,
  MediaImageSource,
  PageSource,
} from '@custom/schema/source';
import { Page } from '@custom/ui/routes/Page';
import {
  CmsCollection,
  CmsField,
  PreviewTemplateComponentProps,
} from 'netlify-cms-core';
import { z, ZodType, ZodTypeDef } from 'zod';

import { PreviewFrame } from '../helpers/frame';
import { transformMarkdown } from '../helpers/markdown';
import { useQuery } from '../helpers/query';

// =============================================================================
// Decap CMS collection definition.
// =============================================================================
export const PageCollection: CmsCollection = {
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
      i18n: true,
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
};

// =============================================================================
// Transformation schema definitions.
// =============================================================================

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

export const pageSchema: ZodType<PageSource, ZodTypeDef, unknown> = z
  .object({
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
  })
  .transform((page) => ({
    ...page,
    id: `${page.id}:${page.locale}`,
  }));

// =============================================================================
// Decap CMS preview component.
// =============================================================================
export function PagePreview({
  entry,
  getAsset,
}: PreviewTemplateComponentProps) {
  // Extract data from Decap input.
  const input = entry.toJS().data;

  // Parse that input and transform it to a GraphQL Source input.
  const parsed = pageSchema.safeParse({ ...input, locale: 'en' });
  if (!parsed.success) {
    console.error(parsed.error);
  }

  const previewSourceData = parsed.success
    ? parsed.data
    : ({
        __typename: 'Page',
        title: '[Missing title]',
        path: '/preview' as Url,
        locale: 'en',
      } satisfies PageSource);

  // Execute the "Preview" query on that source input to transform
  // data into the exact shape of the query result expected by the
  // route.
  const data = useQuery(
    PreviewPageQuery,
    {
      previewPage: previewSourceData,
    } satisfies PreviewPageQuery,
    {
      id: '',
      rid: '',
      locale: '',
    },
    (src) => getAsset(src).url,
  );

  return (
    <PreviewFrame>
      {data?.previewPage ? <Page page={data.previewPage} /> : null}
    </PreviewFrame>
  );
}

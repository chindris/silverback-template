import { ImageSource, Markup, Url } from '@custom/schema';
import {
  BlockMarkupSource,
  BlockMediaSource,
  LocaleSource,
  MediaImageSource,
  PageSource,
} from '@custom/schema/source';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { z, ZodType, ZodTypeDef } from 'zod';

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

export const pageTransformer = createTransformer<PageSource>(pageSchema);

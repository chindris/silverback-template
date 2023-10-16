import { Markup } from '@custom/schema';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { z } from 'zod';

export const transformMarkdown = z
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

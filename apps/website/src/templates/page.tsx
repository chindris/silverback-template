import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import {
  Locale,
  PageListEntryFragment,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { HeadProps, PageProps } from 'gatsby';
import React from 'react';

export const query = graphql(ViewPageQuery);

export function Head({ data }: HeadProps<typeof query>) {
  return data.page ? (
    <>
      <title>{data.page.title}</title>
      {data.page.metaTags?.map((metaTag, index) => {
        if (metaTag?.tag === 'meta') {
          return (
            <meta
              key={`meta-${index}`}
              name={metaTag.attributes?.name || metaTag.attributes?.property}
              content={metaTag.attributes?.content}
            />
          );
        } else if (metaTag?.tag === 'link') {
          return (
            <link
              key={`link-${index}`}
              rel={metaTag.attributes?.rel}
              href={metaTag.attributes?.href}
            />
          );
        }
        return null;
      }) || null}
    </>
  ) : null;
}

export default function PageTemplate({
  data,
  pageContext,
}: PageProps<typeof query, PageListEntryFragment>) {
  registerExecutor(
    ViewPageQuery,
    {
      id: pageContext.id,
      locale: pageContext.locale,
    },
    data,
  );
  return (
    <Page id={pageContext.id} locale={(pageContext.locale || 'en') as Locale} />
  );
}

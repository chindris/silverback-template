import { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { Locale, registerExecutor, ViewPageQuery } from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { graphql, HeadProps, PageProps } from 'gatsby';
import React from 'react';

// TODO: Remove duplication of queries here.
export const query = graphql`
  query DecapPageTemplate($id: String!) {
    page: decapPage(id: { eq: $id }) {
      ...Page
    }
  }
`;

export function Head({ data }: HeadProps<ViewPageQuery>) {
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

export default function DecapPageTemplate({
  data,
  pageContext,
}: PageProps<ViewPageQuery, SilverbackPageContext>) {
  registerExecutor(
    ViewPageQuery,
    {
      id: pageContext.id,
      locale: pageContext.locale,
    },
    data,
  );
  return (
    <Page
      id={pageContext.id}
      locale={(pageContext.locale as Locale) || Locale.En}
    />
  );
}

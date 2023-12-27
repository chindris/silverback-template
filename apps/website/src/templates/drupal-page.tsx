import { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import {
  Locale,
  PageFragment,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { graphql, HeadProps, PageProps } from 'gatsby';
import React from 'react';

export const query = graphql`
  query DrupalPageTemplate($remoteId: String!) {
    page: drupalPage(_id: { eq: $remoteId }) {
      ...Page
    }
  }
`;

type PageTemplateQuery = {
  page: PageFragment;
};

export function Head({ data }: HeadProps<PageTemplateQuery>) {
  return (
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
  );
}

export default function DrupalPageTemplate({
  data,
  pageContext,
}: PageProps<PageTemplateQuery, SilverbackPageContext>) {
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

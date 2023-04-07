import { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { Locale, PageFragment } from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { graphql, HeadProps, PageProps } from 'gatsby';
import React from 'react';

import { Wrapper } from '../utils/wrapper';

export const query = graphql`
  query PageTemplate($remoteId: String!) {
    page(remoteId: { eq: $remoteId }) {
      ...Page
    }
  }
`;

type PageTemplateQuery = {
  page: PageFragment;
};

export function Head({ data }: HeadProps<PageTemplateQuery>) {
  return <meta title={data.page.title} />;
}

export default function PageTemplate({
  data,
  pageContext,
}: PageProps<PageTemplateQuery, SilverbackPageContext>) {
  return (
    <Wrapper locale={(pageContext.locale || 'en') as Locale}>
      <Page page={data.page} />
    </Wrapper>
  );
}

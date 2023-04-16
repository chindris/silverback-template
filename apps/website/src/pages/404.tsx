import { Page } from '@custom/ui/routes/Page';
import React from 'react';

import { PageFragment } from '@custom/schema';

import {
  LanguageNegotiator,
  LanguageNegotiatorContent,
} from '../utils/language-negotiator';
import { graphql, PageProps } from 'gatsby';
import { Wrapper } from '../utils/wrapper';

export const query = graphql`
  query NotFoundPage {
    websiteSettings {
      notFoundPage {
        translations {
          locale
          ...Page
        }
      }
    }
  }
`;

type NotFoundPageQuery = {
  websiteSettings?: {
    notFoundPage?: {
      translations?: Array<
        {
          locale: string;
        } & PageFragment
      >;
    };
  };
};

export function Head() {
  return <meta title="Page not found" />;
}

export default function Index({ data }: PageProps<NotFoundPageQuery>) {
  return (
    <Wrapper>
      <LanguageNegotiator defaultLanguage={'en'}>
        {data.websiteSettings?.notFoundPage?.translations?.map(
          ({ locale, ...page }) => (
            <LanguageNegotiatorContent key={locale} language={locale}>
              <Page page={page} />
            </LanguageNegotiatorContent>
          ),
        )}
      </LanguageNegotiator>
    </Wrapper>
  );
}

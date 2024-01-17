import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import {
  NotFoundPageQuery,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { PageProps } from 'gatsby';
import React from 'react';

import {
  LanguageNegotiator,
  LanguageNegotiatorContent,
} from '../utils/language-negotiator';

export const query = graphql(NotFoundPageQuery);

function isTruthy<T>(value: T | undefined | null): value is T {
  return Boolean(value);
}

export default function Index({ data }: PageProps<typeof query>) {
  data.websiteSettings?.notFoundPage?.translations
    ?.filter(isTruthy)
    .forEach(({ id, locale, ...page }) => {
      registerExecutor(
        ViewPageQuery,
        {
          id,
          locale,
        },
        {
          page,
        },
      );
    });
  return (
    <LanguageNegotiator defaultLanguage={'en'}>
      {data.websiteSettings?.notFoundPage?.translations
        ?.filter(isTruthy)
        .map(({ id, locale }) => (
          <LanguageNegotiatorContent key={locale} language={locale}>
            <Page id={id} locale={locale} />
          </LanguageNegotiatorContent>
        ))}
    </LanguageNegotiator>
  );
}

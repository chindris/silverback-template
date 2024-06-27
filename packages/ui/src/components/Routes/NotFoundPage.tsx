import { NotFoundPageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { LanguageNegotiator } from '../../utils/language-negotiator';
import { withOperation } from '../../utils/with-operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export const NotFoundPage = withOperation(
  NotFoundPageQuery,
  ({ websiteSettings }) => {
    return websiteSettings?.notFoundPage?.translations ? (
      <>
        {websiteSettings?.notFoundPage?.translations
          .filter(isTruthy)
          .map((page) => (
            <LanguageNegotiator locale={page?.locale} key={page?.locale}>
              <PageDisplay {...page} />
            </LanguageNegotiator>
          ))}
      </>
    ) : (
      <div />
    );
  },
);

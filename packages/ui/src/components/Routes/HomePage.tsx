import { HomePageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useLocalized } from '../../utils/locale';
import { Translations } from '../../utils/translations';
import { withOperation } from '../../utils/with-operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export const HomePage = withOperation(HomePageQuery, (operationResult) => {
  const page = useLocalized(
    operationResult.websiteSettings?.homePage?.translations,
  );
  const translations = Object.fromEntries(
    operationResult.websiteSettings?.homePage?.translations
      ?.filter(isTruthy)
      .map((translation) => [translation.locale, translation.path]) || [],
  );
  return page ? (
    <Translations translations={translations}>
      <PageDisplay {...page} />
    </Translations>
  ) : null;
});

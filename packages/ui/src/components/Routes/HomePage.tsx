import { HomePageQuery, useLocalized } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { useTranslations } from '../../utils/translations';
import { PageDisplay } from '../Organisms/PageDisplay';

export function HomePage() {
  const { data } = useOperation(HomePageQuery);
  const page = useLocalized(data?.websiteSettings?.homePage?.translations);

  // Initialize the language switcher with the options this page has.
  useTranslations(
    Object.fromEntries(
      data?.websiteSettings?.homePage?.translations
        ?.filter(isTruthy)
        .map((translation) => [translation.locale, translation.path]) || [],
    ),
  );
  return page ? <PageDisplay {...page} /> : null;
}

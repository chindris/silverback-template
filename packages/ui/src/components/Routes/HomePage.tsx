import { HomePageQuery, useLocalized } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy.js';
import { useOperation } from '../../utils/operation.js';
import { useTranslations } from '../../utils/translations.js';
import { PageDisplay } from '../Organisms/PageDisplay.js';

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

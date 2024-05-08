import { useLocation, ViewPageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { useOperation } from '../../utils/operation';
import { useTranslations } from '../../utils/translations';
import { PageDisplay } from '../Organisms/PageDisplay';

export function Blog() {
  // Retrieve the current location and load the page
  // behind it.
  const [loc] = useLocation();
  const { data } = useOperation(ViewPageQuery, { pathname: loc.pathname });

  // Initialize the language switcher with the options this page has.
  useTranslations(
    Object.fromEntries(
      data?.page?.translations
        ?.filter(isTruthy)
        .map((translation) => [translation.locale, translation.path]) || [],
    ),
  );
  return data?.page ? <PageDisplay {...data.page} /> : null;
}

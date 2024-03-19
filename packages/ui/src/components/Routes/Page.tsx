import { useLocation, ViewPageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy.js';
import { useOperation } from '../../utils/operation.js';
import { useTranslations } from '../../utils/translations.js';
import { PageDisplay } from '../Organisms/PageDisplay.js';

export function Page({ path }: { path?: string }) {
  // Retrieve the current location and load the page
  // behind it.
  const [loc] = useLocation();
  const { data } = useOperation(ViewPageQuery, {
    pathname: path ?? loc.pathname,
  });

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

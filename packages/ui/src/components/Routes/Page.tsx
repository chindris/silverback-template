import { useLocation, ViewPageQuery } from '@custom/schema';
import React from 'react';

import { isTruthy } from '../../utils/isTruthy';
import { Translations } from '../../utils/translations';
import { withOperation } from '../../utils/with-operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export const PageWithData = withOperation(ViewPageQuery, (result) => {
  // Initialize the language switcher with the options this page has.
  const translations = Object.fromEntries(
    result?.page?.translations
      ?.filter(isTruthy)
      .map((translation) => [translation.locale, translation.path]) || [],
  );
  return result?.page ? (
    <Translations translations={translations}>
      <PageDisplay {...result.page} />
    </Translations>
  ) : null;
});

export function Page() {
  // Retrieve the current location and load the page
  // behind it.
  const [loc] = useLocation();
  return <PageWithData pathname={loc.pathname} />;
}

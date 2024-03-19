import { Locale } from '@custom/schema';
import React from 'react';

import { useTranslations } from '../../utils/translations.js';
import { PageTransition } from '../Molecules/PageTransition.js';
import { ContentHub as ContentHubOrganism } from '../Organisms/ContentHub.js';

export function ContentHub(props: { pageSize: number }) {
  // Initialize the content hub in each language.
  useTranslations(
    Object.fromEntries(
      Object.values(Locale).map((locale) => [locale, `/${locale}/content-hub`]),
    ),
  );
  return (
    <PageTransition>
      <ContentHubOrganism pageSize={props.pageSize} />
    </PageTransition>
  );
}

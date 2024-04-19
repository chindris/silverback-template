import { Locale } from '@custom/schema';
import React from 'react';

import { useTranslations } from '../../utils/translations';
import { PageTransition } from '../Molecules/PageTransition';
import { Inquiry as InquiryOrganism } from '../Organisms/Inquiry';

export function Inquiry() {
  // Initialize the inquiry page in each language.
  useTranslations(
    Object.fromEntries(
      Object.values(Locale).map((locale) => [locale, `/${locale}/inquiry`]),
    ),
  );
  return (
    <PageTransition>
      <InquiryOrganism />
    </PageTransition>
  );
}

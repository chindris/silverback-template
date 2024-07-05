import { Locale } from '@custom/schema';
import React from 'react';

import { Translations } from '../../utils/translations';
import { PageTransition } from '../Molecules/PageTransition';
import { Inquiry as InquiryOrganism } from '../Organisms/Inquiry';

export function Inquiry() {
  const translations = Object.fromEntries(
    Object.values(Locale).map((locale) => [locale, `/${locale}/inquiry`]),
  );
  return (
    <PageTransition>
      <Translations translations={translations}>
        <InquiryOrganism />
      </Translations>
    </PageTransition>
  );
}

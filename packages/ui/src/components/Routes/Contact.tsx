import { Locale } from '@custom/schema';
import React from 'react';

import { useTranslations } from '../../utils/translations';
import { PageTransition } from '../Molecules/PageTransition';
import { Contact as ContactOrganism } from '../Organisms/Contact';

export function Contact() {
  // Initialize the contact page in each language.
  useTranslations(
    Object.fromEntries(
      Object.values(Locale).map((locale) => [locale, `/${locale}/contact`]),
    ),
  );
  return (
    <PageTransition>
      <ContactOrganism />
    </PageTransition>
  );
}

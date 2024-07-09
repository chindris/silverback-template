'use client';
import { Locale } from '@custom/schema';
import { PropsWithChildren, useEffect, useState } from 'react';

import { defaultLocale, isLocale } from './locale';

/**
 * Display contents only if the current locale matches the provided one.
 */
export function LanguageNegotiator({
  locale,
  children,
}: PropsWithChildren<{ locale: Locale }>) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);
  useEffect(() => {
    const prefix = window.location.pathname.split('/')[1];
    if (isLocale(prefix)) {
      setCurrentLocale(prefix);
    }
  }, [setCurrentLocale]);
  return locale === currentLocale ? children : null;
}

'use client';

import { Locale } from '@custom/schema';
import React, { PropsWithChildren, useEffect } from 'react';

const NegotiatorContext = React.createContext<string | undefined>(undefined);

export function useCurrentLanguagePrefix(defaultLanguage = 'en') {
  const [language, setLanguage] = React.useState<string>(defaultLanguage);
  useEffect(() => {
    const prefix = window.location.pathname.split('/')[1];
    if (
      prefix !== language &&
      Object.values(Locale).includes(prefix as Locale)
    ) {
      setLanguage(prefix);
    }
  }, [language]);
  return language as Locale;
}

export function LanguageNegotiator({
  children,
  defaultLanguage = 'en',
}: PropsWithChildren<{ defaultLanguage?: string }>) {
  return (
    <NegotiatorContext.Provider
      value={useCurrentLanguagePrefix(defaultLanguage)}
    >
      {children}
    </NegotiatorContext.Provider>
  );
}

export function LanguageNegotiatorContent({
  children,
  language,
}: PropsWithChildren<{ language: string }>) {
  const currentLanguage = React.useContext(NegotiatorContext);
  return language === currentLanguage ? <>{children}</> : null;
}

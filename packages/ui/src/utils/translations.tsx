'use client';
import { FrameQuery, Locale, Url } from '@custom/schema';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { isTruthy } from './isTruthy';
import { useOperation } from './operation';

/**
 * A list of translations for the given page.
 * A translations consists of the locale and the corresponding path.
 */
export type TranslationPaths = Partial<Record<Locale, Url>>;

export const TranslationsContext = createContext<{
  translations: TranslationPaths;
  setTranslations: (translations: TranslationPaths) => void;
}>({
  translations: {},
  setTranslations: () => {},
});

export function TranslationsProvider({
  children,
  defaultTranslations,
}: PropsWithChildren<{ defaultTranslations?: TranslationPaths }>) {
  const [translations, setTranslations] = useState<TranslationPaths>(
    defaultTranslations || {},
  );
  return (
    <TranslationsContext.Provider value={{ translations, setTranslations }}>
      {children}
    </TranslationsContext.Provider>
  );
}

function deepCompare(a: any, b: any) {
  return (
    a &&
    b &&
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((key) => a[key] === b[key])
  );
}

export function Translations({
  translations: newTranslations,
  children,
}: PropsWithChildren<{
  translations: TranslationPaths;
}>) {
  const { setTranslations, translations } = useContext(TranslationsContext);
  useEffect(() => {
    if (newTranslations && !deepCompare(translations, newTranslations)) {
      setTranslations(newTranslations);
    }
  }, [setTranslations, newTranslations, translations]);
  return children;
}

export function useTranslations() {
  const homeTranslations = Object.fromEntries(
    useOperation(FrameQuery)
      .data?.websiteSettings?.homePage?.translations?.filter(isTruthy)
      .map(({ locale, path }) => [locale, path]) || [],
  );
  const { translations } = useContext(TranslationsContext);

  const homePaths = Object.fromEntries(
    Object.values(Locale).map((locale) => [locale, `/${locale}` as Url]),
  );

  return deepCompare(homeTranslations, translations) ? homePaths : translations;
}

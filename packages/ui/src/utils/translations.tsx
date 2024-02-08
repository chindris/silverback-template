import { Locale, Url } from '@custom/schema';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * A list of translations for the given page.
 * A translations consists of the locale and the corresponding path.
 */
export type Translations = Partial<Record<Locale, Url>>;

export const TranslationsContext = createContext<{
  translations: Translations;
  setTranslations: (translations: Translations) => void;
}>({
  translations: {},
  setTranslations: () => {},
});

export function TranslationsProvider({
  children,
  defaultTranslations,
}: PropsWithChildren<{ defaultTranslations?: Translations }>) {
  const [translations, setTranslations] = useState<Translations>(
    defaultTranslations || {},
  );
  return (
    <TranslationsContext.Provider value={{ translations, setTranslations }}>
      {children}
    </TranslationsContext.Provider>
  );
}

function deepCompare(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useTranslations(newTranslations?: Translations) {
  const { setTranslations, translations } = useContext(TranslationsContext);
  useEffect(() => {
    if (newTranslations && !deepCompare(translations, newTranslations)) {
      setTranslations(newTranslations);
    }
  }, [setTranslations, newTranslations, translations]);
  return translations;
}

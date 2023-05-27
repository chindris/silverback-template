import { Locale } from '@custom/schema';
import { graphql, useStaticQuery } from 'gatsby';

export const coreLanguages = ['en', 'de'];
export const defaultLocale = 'en';

type StringTranslations = Array<{
  id: string;
  message: string;
}>

export function useTranslationMessages() {
  return useStaticQuery<{
    [key in typeof coreLanguages[number]]: StringTranslations
  }>(graphql`
    query TranslationMessages {
      en: stringTranslations(locale: "en") {
        id
        message
      }
      de: stringTranslations(locale: "de") {
        id
        message
      }
    }
  `);
}

export function languageFallback(locale: Locale): typeof coreLanguages[number] {
  return coreLanguages.includes(locale) ? locale : defaultLocale;
}

export const useTranslations = (
  locale: Locale,
) => {
  const messages = useTranslationMessages();

  return {
    defaultLocale,
    locale: locale || defaultLocale,
    messages: (
      messages[languageFallback(locale || defaultLocale) as Locale] ||
      messages['en']
    )
      ?.map((msg) => ({ [msg.id]: msg.message }))
      .reduce((acc, val) => ({ ...acc, ...val }), {}),
  };
};

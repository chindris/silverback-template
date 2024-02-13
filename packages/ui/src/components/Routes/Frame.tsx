import { FrameQuery, Locale, useLocale } from '@custom/schema';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

import translationSources from '../../../build/translatables.json';
import { useOperation } from '../../utils/operation';
import { TranslationsProvider } from '../../utils/translations';
import { Footer } from '../Organisms/Footer';
import { Header } from '../Organisms/Header';

function filterByLocale(locale: Locale) {
  return (str: FrameQuery['stringTranslations'][number]) =>
    str.locale === locale;
}

function translationsMap(translatables: FrameQuery['stringTranslations']) {
  return Object.fromEntries(
    translatables
      .filter((tr) => tr.translation)
      .map((tr) => [tr.source, tr.translation]),
  );
}

function useTranslations() {
  const locale = useLocale();
  const translations = useOperation(FrameQuery).data?.stringTranslations;
  console.log('out', translations);
  return {
    ...translationsMap(translations?.filter(filterByLocale('en')) || []),
    ...translationsMap(translations?.filter(filterByLocale(locale)) || []),
  };
}

export function Frame(props: PropsWithChildren<{}>) {
  const locale = useLocale();
  const translations = useTranslations();
  const messages = Object.fromEntries(
    Object.keys(translationSources).map((key) => [
      key,
      translations[
        translationSources[key as keyof typeof translationSources]
          .defaultMessage
      ] ||
        translationSources[key as keyof typeof translationSources]
          .defaultMessage,
    ]),
  );
  return (
    <IntlProvider locale={locale} messages={messages}>
      <TranslationsProvider>
        <Header />
        <main>
          {useReducedMotion() ? (
            <>{props.children}</>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {props.children}
            </AnimatePresence>
          )}
        </main>
        <Footer />
      </TranslationsProvider>
    </IntlProvider>
  );
}

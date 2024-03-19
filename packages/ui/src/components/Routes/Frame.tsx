import { FrameQuery, Locale, useLocale } from '@custom/schema';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

import translationSources from '../../../build/translatables.json' assert { type: 'json' };
import { useOperation } from '../../utils/operation.js';
import { TranslationsProvider } from '../../utils/translations.js';
import { Footer } from '../Organisms/Footer.js';
import { Header } from '../Organisms/Header.js';

function filterByLocale(locale: Locale) {
  return (str: Exclude<FrameQuery['stringTranslations'], undefined>[number]) =>
    str.language === locale;
}

function translationsMap(translatables: FrameQuery['stringTranslations']) {
  return Object.fromEntries(
    [
      // Make sure that Drupal translations have higher precedence.
      ...(translatables?.filter(
        (tr) => tr.__typename === 'DecapTranslatableString',
      ) || []),
      ...(translatables?.filter(
        (tr) => tr.__typename === 'DrupalTranslatableString',
      ) || []),
    ]
      .filter((tr) => tr.translation)
      .map((tr) => [tr.source, tr.translation]),
  );
}

function useTranslations() {
  const locale = useLocale();
  const translations = useOperation(FrameQuery).data?.stringTranslations;
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

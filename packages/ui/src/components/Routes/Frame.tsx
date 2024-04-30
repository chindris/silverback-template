import { IntlProvider } from '@amazeelabs/react-intl';
import {
  ExecuteOperation,
  FrameQuery,
  Locale,
  useLocale,
} from '@custom/schema';
import React, { PropsWithChildren, ReactNode } from 'react';

import translationSources from '../../../build/translatables.json';
import { useOperation } from '../../utils/operation';
import { TranslationsProvider } from '../../utils/translations';

function filterByLocale(locale: Locale) {
  return (str: Exclude<FrameQuery['stringTranslations'], undefined>[number]) =>
    str.language === locale;
}

function hasTranslation<T extends { translation?: string }>(
  value: T,
): value is T & { translation: string } {
  return !!value?.translation;
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
      .filter(hasTranslation)
      .map((tr) => [tr.source, tr.translation]),
  );
}

function Translations({
  children,
}: {
  children: (translations: Record<string, string>) => JSX.Element;
}) {
  const locale = useLocale();
  return (
    <ExecuteOperation id={FrameQuery}>
      {({ result }) => {
        return children({
          ...translationsMap(
            result.stringTranslations?.filter(filterByLocale('en')) || [],
          ),
          ...translationsMap(
            result.stringTranslations?.filter(filterByLocale(locale)) || [],
          ),
        });
      }}
    </ExecuteOperation>
  );
}

export async function Frame({ children }: PropsWithChildren<{}>) {
  // const locale = useLocale();
  // const translations = await useTranslations();
  // const messages = Object.fromEntries(
  //   Object.keys(translationSources).map((key) => [
  //     key,
  //     translations[
  //       translationSources[key as keyof typeof translationSources]
  //         .defaultMessage
  //     ] ||
  //       translationSources[key as keyof typeof translationSources]
  //         .defaultMessage,
  //   ]),
  // );
  return (
    <Translations>
      {
        (translations) => <>{children}</>
        // <IntlProvider messages={translations}>{props.children}</IntlProvider>
      }
    </Translations>
  );
}

import { Locale, NavigationFragment } from '@custom/schema';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { graphql, useStaticQuery } from 'gatsby';
import React, { PropsWithChildren } from 'react';

import { useTranslations } from './i18n';

function useFrameQuery() {
  return useStaticQuery<{
    main_de: NavigationFragment;
    main_en: NavigationFragment;
    footer_de: NavigationFragment;
    footer_en: NavigationFragment;
  }>(graphql`
    query Frame {
      main_de: mainNavigation(langcode: { eq: "de" }) {
        ...Navigation
      }
      main_en: mainNavigation(langcode: { eq: "en" }) {
        items {
          ...NavigationItem
        }
      }
      footer_de: footerNavigation(langcode: { eq: "de" }) {
        items {
          ...NavigationItem
        }
      }
      footer_en: footerNavigation(langcode: { eq: "en" }) {
        items {
          ...NavigationItem
        }
      }
    }
  `);
}

export function Wrapper({
  children,
  locale = 'en',
}: PropsWithChildren<{ locale?: Locale }>) {
  const data = useFrameQuery();
  const main = locale === 'de' ? data.main_de : data.main_en;
  const footer = locale === 'de' ? data.footer_de : data.footer_en;
  const messages = useTranslations(locale);
  return (
    <IntlProvider {...messages} >
      <Frame
        header={{ mainNavigation: main }}
        footer={{ footerNavigation: footer }}
      >
        {children}
      </Frame>
    </IntlProvider>
  );
}

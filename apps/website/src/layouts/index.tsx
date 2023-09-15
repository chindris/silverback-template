import { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { NavigationFragment } from '@custom/schema';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { graphql, useStaticQuery, WrapPageElementNodeArgs } from 'gatsby';
import React, { PropsWithChildren } from 'react';

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

export default function Layout({
  children,
  pageContext: { locale },
}: PropsWithChildren<
  WrapPageElementNodeArgs<any, SilverbackPageContext>['props']
>) {
  const data = useFrameQuery();
  const main = locale === 'de' ? data.main_de : data.main_en;
  const footer = locale === 'de' ? data.footer_de : data.footer_en;
  return (
    <IntlProvider locale={locale || 'en'}>
      <Frame
        header={{ mainNavigation: main }}
        footer={{ footerNavigation: footer }}
      >
        {children}
      </Frame>
    </IntlProvider>
  );
}

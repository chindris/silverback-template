import { Locale, registerExecutor } from '@custom/schema';
import { loadFonts } from '@custom/ui/fonts-async';
import { GatsbySSR } from 'gatsby';
import React from 'react';

import { drupalExecutor } from './src/utils/drupal-executor';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHtmlAttributes,
  pathname,
  setHeadComponents,
}) => {
  registerExecutor(drupalExecutor(`/graphql`));
  const locales = Object.values(Locale);
  if (locales.length === 1) {
    // Single-language project.
    setHtmlAttributes({
      lang: locales[0],
    });
  } else {
    // Multi-language project.
    const prefix = pathname.split('/')[1];
    if (locales.includes(prefix as Locale)) {
      setHtmlAttributes({
        lang: prefix,
      });
    } else {
      // We don't know the language.
    }
  }

  setHeadComponents([
    // here you will map config file consumed
    <link
      rel="preload"
      href="/fonts/NotoSansGurmukhi-Regular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="NotoSansGurmukhi"
    />,
  ]);
};

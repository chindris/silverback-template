import { Locale } from '@custom/schema';
import { GatsbySSR } from 'gatsby';
import React from 'react';

import fonts from './node_modules/@custom/ui/build/preloaded-fonts.json';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHtmlAttributes,
  pathname,
  setHeadComponents,
}) => {
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

  fonts.forEach((font) => {
    setHeadComponents([
      <link
        rel="preload"
        href={font}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
        key={font}
      />,
    ]);
  });
};

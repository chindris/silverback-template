import './styles.css';

import { Locale } from '@custom/schema';
import { GatsbySSR } from 'gatsby';
import React from 'react';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHtmlAttributes,
  setHeadComponents,
  pathname,
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
  // Remove this if Netlify identity is not used.
  setHeadComponents([
    <script
      key="netlify-identity-widget"
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
    />,
    <script key="netlify-identity-redirect" dangerouslySetInnerHTML={{
      __html: `
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
`}} />
  ]);
};

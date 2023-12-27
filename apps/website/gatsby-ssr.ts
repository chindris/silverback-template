import './styles.css';

import { Locale, registerExecutor } from '@custom/schema';
import { GatsbySSR } from 'gatsby';

import { drupalExecutor } from './src/utils/drupal-executor';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHtmlAttributes,
  pathname,
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
};

import { useLocale } from '@custom/schema';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';

import { TranslationsProvider } from '../../utils/translations';
import { Footer } from '../Organisms/Footer';
import { Header } from '../Organisms/Header';

export function Frame(props: PropsWithChildren<{}>) {
  return (
    <IntlProvider locale={useLocale()}>
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

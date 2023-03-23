import type { NavigationQuery } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

import { Footer } from '../organisms/Footer';
import Header from '../organisms/Header';

export function Frame(props: PropsWithChildren<NavigationQuery>) {
  return (
    <div>
      <Header
        mainNavigation={props.mainNavigation}
        metaNavigation={props.metaNavigation}
      />
      {props.children}
      <Footer footerNavigation={props.footerNavigation} />
    </div>
  );
}

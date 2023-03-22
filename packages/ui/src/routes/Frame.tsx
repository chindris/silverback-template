import { NavigationFragment } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

import { Footer } from '../components/organisms/Footer';
import Header from '../components/organisms/Header';

export function Frame(props: PropsWithChildren<NavigationFragment>) {
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

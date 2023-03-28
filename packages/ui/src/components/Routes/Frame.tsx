import type { FrameQuery } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

import { Footer } from '../Organisms/Footer';
import Header from '../Organisms/Header';

export function Frame(props: PropsWithChildren<FrameQuery>) {
  return (
    <div>
      <Header mainNavigation={props.mainNavigation} />
      {props.children}
      <Footer footerNavigation={props.footerNavigation} />
    </div>
  );
}

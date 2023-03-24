import type { FrameQuery } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

import { Footer } from '../organisms/Footer';
import Header from '../organisms/Header';

export function Frame(props: PropsWithChildren<FrameQuery>) {
  return (
    <div>
      <Header mainNavigation={props.mainNavigation} />
      {props.children}
      <Footer footerNavigation={props.footerNavigation} />
    </div>
  );
}

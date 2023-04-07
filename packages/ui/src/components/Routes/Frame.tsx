import React, { ComponentProps, PropsWithChildren } from 'react';

import { Footer } from '../Organisms/Footer';
import Header from '../Organisms/Header';

export function Frame(
  props: PropsWithChildren<{
    header: ComponentProps<typeof Header>;
    footer: ComponentProps<typeof Footer>;
  }>,
) {
  return (
    <div>
      <Header {...props.header} />
      {props.children}
      <Footer {...props.footer} />
    </div>
  );
}

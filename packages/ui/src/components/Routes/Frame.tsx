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
      <main>{props.children}</main>
      <Footer {...props.footer} />
    </div>
  );
}

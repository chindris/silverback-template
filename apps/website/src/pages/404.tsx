import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';

export function Head() {
  return <meta title="Home" />;
}

export default function Index() {
  return (
    <IntlProvider locale={'en'}>
      <Frame mainNavigation={[]} metaNavigation={[]} footerNavigation={[]}>
        <Page page={{ title: 'Not found!' }} />
      </Frame>
    </IntlProvider>
  );
}

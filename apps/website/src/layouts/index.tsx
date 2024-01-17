import { graphql, useStaticQuery } from '@amazeelabs/gatsby-plugin-operations';
import { FrameQuery, registerExecutor } from '@custom/schema';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import React, { PropsWithChildren } from 'react';

export default function Layout({
  children,
  locale,
}: PropsWithChildren<{
  locale: string;
}>) {
  const data = useStaticQuery(graphql(FrameQuery));
  registerExecutor(FrameQuery, data);
  return (
    <IntlProvider locale={locale || 'en'}>
      <Frame>{children}</Frame>
    </IntlProvider>
  );
}

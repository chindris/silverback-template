import { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { FrameQuery, registerExecutor } from '@custom/schema';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { graphql, useStaticQuery, WrapPageElementNodeArgs } from 'gatsby';
import React, { PropsWithChildren } from 'react';

export default function Layout({
  children,
  pageContext: { locale },
}: PropsWithChildren<
  WrapPageElementNodeArgs<any, SilverbackPageContext>['props']
>) {
  // TODO: Remove duplication of queries here.
  const data = useStaticQuery<FrameQuery>(graphql`
    query Frame {
      mainNavigation: mainNavigations {
        ...Navigation
      }
      footerNavigation: footerNavigations {
        ...Navigation
      }
    }
  `);
  registerExecutor(FrameQuery, data);
  return (
    <IntlProvider locale={locale || 'en'}>
      <Frame>{children}</Frame>
    </IntlProvider>
  );
}

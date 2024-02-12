import React from 'react';
import { GatsbyBrowser, WrapRootElementBrowserArgs } from 'gatsby';
import { SessionProvider } from 'next-auth/react';

export const WrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}: WrapRootElementBrowserArgs) => (
  <SessionProvider>{element}</SessionProvider>
);

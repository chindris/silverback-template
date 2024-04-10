import { graphql, useStaticQuery } from '@amazeelabs/gatsby-plugin-operations';
import { FrameQuery, registerExecutor } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import React, { PropsWithChildren } from 'react';

export default function Layout({
  children,
}: PropsWithChildren<{
  locale: string;
}>) {
  const data = useStaticQuery(graphql(FrameQuery));
  registerExecutor(FrameQuery, data);
  return <Frame>{children}</Frame>;
}

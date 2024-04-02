import { graphql, useStaticQuery } from '@amazeelabs/gatsby-plugin-operations';
import { FrameQuery, OperationExecutor } from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import React, { PropsWithChildren } from 'react';

import { drupalExecutor } from '../utils/drupal-executor';

export default function Layout({
  children,
}: PropsWithChildren<{
  locale: string;
}>) {
  const data = useStaticQuery(graphql(FrameQuery));
  return (
    <OperationExecutor executor={drupalExecutor(`/graphql`)}>
      <OperationExecutor executor={data} id={FrameQuery}>
        <Frame>{children}</Frame>
      </OperationExecutor>
    </OperationExecutor>
  );
}

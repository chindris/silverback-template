import { createDrupalExecutor } from '@custom/cms';
import { OperationExecutorsProvider } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

export function DrupalExecutor({
  children,
  url,
}: PropsWithChildren<{ url: string }>) {
  return (
    <OperationExecutorsProvider
      executors={[{ executor: createDrupalExecutor(`${url}/graphql`) }]}
    >
      {children}
    </OperationExecutorsProvider>
  );
}

'use client';
import { createDrupalExecutor } from '@custom/cms';
import { OperationExecutorsProvider } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

import { drupalUrl, frontendUrl } from './utils.js';

export function ClientExecutors({ children }: PropsWithChildren) {
  return (
    <OperationExecutorsProvider
      executors={[
        {
          executor: createDrupalExecutor(drupalUrl, frontendUrl),
        },
      ]}
    >
      {children}
    </OperationExecutorsProvider>
  );
}
'use client';
import { createDrupalExecutor } from '@custom/cms';
import { OperationExecutorsProvider } from '@custom/schema';
import React, { PropsWithChildren } from 'react';

export function ClientExecutors({ children }: PropsWithChildren) {
  return (
    <OperationExecutorsProvider
      executors={[
        {
          executor: createDrupalExecutor(
            import.meta.env.WAKU_PUBLIC_DRUPAL_URL || 'http://127.0.0.1:8888',
          ),
        },
      ]}
    >
      {children}
    </OperationExecutorsProvider>
  );
}

import React, { PropsWithChildren } from 'react';

import { DrupalExecutor } from './drupal-executor.js';

export function ExecutorsServer({ children }: PropsWithChildren) {
  return (
    <DrupalExecutor
      url={process.env.WAKU_PUBLIC_DRUPAL_URL || 'http://127.0.0.1:8888'}
    >
      {children}
    </DrupalExecutor>
  );
}

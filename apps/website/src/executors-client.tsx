'use client';
import React, { PropsWithChildren } from 'react';

import { DrupalExecutor } from './drupal-executor.js';

export function ExecutorsClient({ children }: PropsWithChildren) {
  return (
    <DrupalExecutor
      url={import.meta.env.WAKU_PUBLIC_DRUPAL_URL || 'http://localhost:8888'}
    >
      {children}
    </DrupalExecutor>
  );
}

'use client';
import React, { PropsWithChildren } from 'react';

import { DrupalExecutor } from './drupal-executor.js';

export function ExecutorsClient({ children }: PropsWithChildren) {
  return <DrupalExecutor>{children}</DrupalExecutor>;
}

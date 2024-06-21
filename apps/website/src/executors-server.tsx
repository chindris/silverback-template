import React, { PropsWithChildren } from 'react';

import { DrupalExecutor } from './drupal-executor.js';

export function ExecutorsServer({ children }: PropsWithChildren) {
  return <DrupalExecutor>{children}</DrupalExecutor>;
}

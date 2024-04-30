import { OperationExecutor } from '@custom/schema';
import { PropsWithChildren } from 'react';

import { drupalExecutor } from '../utils/drupal-executor';

export function DrupalExecutor({ children }: PropsWithChildren) {
  return (
    <OperationExecutor
      executor={drupalExecutor('http://localhost:8888/graphql', false)}
    >
      {children}
    </OperationExecutor>
  );
}

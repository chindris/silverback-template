import useSwr from 'swr';

import { AnyOperationId, OperationResult, OperationVariables } from '../build';

export * from '../build';
export * from '@amazeelabs/scalars';

export function useOperation<TOperation extends AnyOperationId>(
  endpoint: string,
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): OperationResult<TOperation> | undefined {
  const result = useSwr<OperationResult<TOperation>>(
    [operation, variables],
    variables
      ? () => {
          const url = new URL(endpoint, window.location.origin);
          url.searchParams.set('queryId', operation);
          url.searchParams.set('variables', JSON.stringify(variables));
          return fetch(url, {
            credentials: 'include',
            headers: {
              // 'SLB-Forwarded-Proto': window.location.protocol.slice(0, -1),
              // 'SLB-Forwarded-Host': window.location.hostname,
              // 'SLB-Forwarded-Port': window.location.port,
            },
          }).then((r) => r.json());
        }
      : null,
    {
      suspense: false,
    },
  );
  return result.data?.data;
}

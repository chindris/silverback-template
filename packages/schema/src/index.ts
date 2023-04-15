export * from '../build';
export * from '@amazeelabs/scalars';
import useSwr from 'swr';
import { AnyOperationId, OperationResult, OperationVariables } from '../build';

export function useOperation<TOperation extends AnyOperationId>(
  endpoint: string,
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): OperationResult<TOperation> | undefined {
  const result = useSwr<OperationResult<TOperation>>(
    [operation, variables],
    variables
      ? () => {
          const url = new URL(endpoint);
          url.searchParams.set('queryId', operation);
          url.searchParams.set('variables', JSON.stringify(variables));
          return fetch(url, {
            credentials: 'include',
          }).then((r) => r.json());
        }
      : null,
    {
      suspense: false,
    },
  );
  return result.data?.data;
}

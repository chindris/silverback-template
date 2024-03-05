import {
  AnyOperationId,
  createExecutor,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import useSwr, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

function swrFetcher<TOperation extends AnyOperationId>(
  operationMetadata: {
    operation: TOperation,
    variables?: OperationVariables<TOperation>,
  },
) {
  const executor = createExecutor(operationMetadata.operation, {
    variables: operationMetadata.variables,
  });
  if (typeof executor === 'function') {
    // @todo: fix this.
    // @ts-ignore
    return executor();
  }
  // If the executor is not a function, then just return it. This means the
  // executor is already the data we want.
  return executor;
}

function swrMutator<TOperation extends AnyOperationId>(
  operationMetadata: {
    operation: TOperation,
  },
  args?: OperationVariables<TOperation>,
) {
  const executor = createExecutor(operationMetadata.operation, {
    graphqlOperationType: 'mutation',
    variables: args?.arg,
  });
  if (typeof executor === 'function') {
    // @todo: fix this.
    // @ts-ignore
    return executor();
  }
  return executor;
}

export function useOperation<TOperation extends AnyOperationId>(
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): SWRResponse<OperationResult<TOperation>> {
  return useSwr<OperationResult<TOperation>>(
    {operation, variables},
    swrFetcher,
    {
      suspense: false,
    },
  );
}

export function useMutation<TOperation extends AnyOperationId>(
  operation: TOperation,
): SWRMutationResponse<OperationResult<TOperation>> {
  return useSWRMutation<OperationResult<TOperation>>(
    {operation},
    // @todo: fix this.
    // @ts-ignore
    swrMutator,
  );
}

import {
  AnyOperationId,
  createExecutor,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import useSwr, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

function swrFetcher<TOperation extends AnyOperationId>(operationMetadata: {
  operation: string;
  variables?: OperationVariables<TOperation>;
}) {
  const executor = createExecutor(operationMetadata.operation as TOperation, {
    variables: operationMetadata.variables,
  });

  if (executor instanceof Function) {
    return executor();
  }
  // If the executor is not a function, then just return it. This means the
  // executor is already the data we want.
  return executor;
}

function swrMutator<TOperation extends AnyOperationId>(
  operation: string,
  args?: OperationVariables<TOperation>,
) {
  const executor = createExecutor(operation as TOperation, {
    graphqlOperationType: 'mutation',
    variables: args?.arg,
  });
  if (executor instanceof Function) {
    return executor();
  }
  return executor;
}

export function useOperation<TOperation extends AnyOperationId>(
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): SWRResponse<OperationResult<TOperation>> {
  return useSwr<OperationResult<TOperation>>(
    { operation, variables },
    swrFetcher,
    {
      suspense: false,
    },
  );
}

export function useMutation<TOperation extends AnyOperationId>(
  operation: TOperation,
): SWRMutationResponse<
  OperationResult<TOperation>,
  string,
  string,
  OperationVariables<TOperation>
> {
  return useSWRMutation<
    OperationResult<TOperation>,
    string,
    string,
    OperationVariables<TOperation>
  >(operation, swrMutator);
}

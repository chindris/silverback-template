import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
  useExecutor,
} from '@custom/schema';
import useSwr, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

// @todo: this does seem to work properly when click on the language switcher
// links. Even though the url does get changed, the data on the page does not.
// This should be use in the useOperation() for the call to useSwr().
/*function swrFetcher<TOperation extends AnyOperationId>(operationMetadata: {
  operation: string;
  variables?: OperationVariables<TOperation>;
}) {
  const executor = createExecutor(
    operationMetadata.operation as TOperation,
    operationMetadata.variables,
  );

  if (executor instanceof Function) {
    return executor();
  }
  // If the executor is not a function, then just return it. This means the
  // executor is already the data we want.
  return executor;
}*/

function swrMutator<TOperation extends AnyOperationId>(
  operation: string,
  args?: OperationVariables<TOperation>,
) {
  const executor = createExecutor(operation as TOperation, args?.arg);
  if (executor instanceof Function) {
    return executor();
  }
  return executor;
}

export function useOperation<TOperation extends AnyOperationId>(
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): Omit<SWRResponse<OperationResult<TOperation>>, 'mutate'> {
  const executor = useExecutor(operation, variables);
  // If the executor is a function, use SWR to manage it.
  const result = useSwr<OperationResult<TOperation>>(
    [operation, variables],
    // If the executor is not a function, pass null to SWR,
    // so it does not try to fetch.
    executor instanceof Function ? (arg) => executor(arg[1]) : null,
    {
      suspense: false,
    },
  );*/
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

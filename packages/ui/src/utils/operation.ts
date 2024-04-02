import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
  useExecutor,
} from '@custom/schema';
import useSwr, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

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

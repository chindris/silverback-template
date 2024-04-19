import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
  useExecutor,
} from '@custom/schema';
import useSwr, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

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
  );
  return executor instanceof Function
    ? result
    : // If the executor is not a function, return a mock SWR response.
      {
        data: executor,
        error: undefined,
        isValidating: false,
        isLoading: false,
      };
}

export function useMutation<TOperation extends AnyOperationId>(
  operation: TOperation,
): SWRMutationResponse<
  OperationResult<TOperation>,
  string,
  string,
  OperationVariables<TOperation>
> {
  // Mutations don't support variable matching, since it does not make sense.
  const executor = useExecutor(operation);
  return useSWRMutation<
    OperationResult<TOperation>,
    string,
    string,
    OperationVariables<TOperation>
  >(operation, (_, opts) =>
    executor instanceof Function ? executor(opts.arg) : executor,
  );
}

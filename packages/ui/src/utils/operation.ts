import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
  useExecutor,
} from '@custom/schema';

export async function useOperation<TOperation extends AnyOperationId>(
  operation: TOperation,
  variables?: OperationVariables<TOperation>,
): Promise<OperationResult<TOperation>> {
  const executor = useExecutor(operation, variables);
  // If the executor is a function, use SWR to manage it.
  return executor instanceof Function ? await executor(variables) : executor;
}

export function useMutation<TOperation extends AnyOperationId>(
  operation: TOperation,
) {
  return null;
}

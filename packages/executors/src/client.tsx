import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

import type {
  ExecuteOperation as ExecuteOperationType,
  RegistryEntry,
} from '../types';
import {
  ExecutorRegistryError,
  getCandidates,
  matchVariables,
  mergeExecutors,
} from './lib';

const ExecutorsContext = createContext<{
  executors: RegistryEntry[];
}>({
  executors: [],
});

export function useExecutor(id: string, variables?: Record<string, any>) {
  const { executors } = useContext(ExecutorsContext);
  const op = getCandidates(id, executors)
    .filter((entry) => matchVariables(entry.variables, variables))
    .pop();

  if (op) {
    if (typeof op.executor === 'function') {
      return (vars?: Record<string, any>) => op.executor(id, vars);
    }
    return op.executor;
  }
  throw new ExecutorRegistryError(executors, id, variables);
}

export function OperationExecutor({
  children,
  ...entry
}: PropsWithChildren<RegistryEntry>) {
  const upstream = useContext(ExecutorsContext).executors;
  const merged = mergeExecutors(upstream, [entry]);
  return (
    <ExecutorsContext.Provider
      value={{
        executors: merged,
      }}
    >
      {children}
    </ExecutorsContext.Provider>
  );
}

export const ExecuteOperation: typeof ExecuteOperationType = ({
  id,
  variables,
  children,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const { executors } = useContext(ExecutorsContext);
  useEffect(() => {
    setLoading(true);

    const op = getCandidates(id, executors)
      .filter((entry) => matchVariables(entry.variables, variables))
      .pop();

    if (op) {
      if (typeof op.executor === 'function') {
        setResult(op.executor(id, variables));
      }
      setResult(op.executor);
    }
    setLoading(false);
  }, [setLoading, setResult, id, variables]);

  return children({ loading, result });
};

import { PropsWithChildren } from 'react';

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

let registry: RegistryEntry[] = [];

export function useExecutor(id: string, variables?: Record<string, any>) {
  const op = getCandidates(id, registry)
    .filter((entry) => matchVariables(entry.variables, variables))
    .pop();
  if (op) {
    if (typeof op.executor === 'function') {
      return (vars?: Record<string, any>) => op.executor(id, vars);
    }
    return op.executor;
  }
  throw new ExecutorRegistryError(registry, id, variables);
}

export function OperationExecutor({
  children,
  ...entry
}: PropsWithChildren<RegistryEntry>) {
  registry = mergeExecutors(registry, [entry]);
  return children;
}

export const ExecuteOperation: typeof ExecuteOperationType = async ({
  id,
  variables,
  children,
}) => {
  const result = await useExecutor(id, variables)(variables);
  return children({ loading: false, result });
};

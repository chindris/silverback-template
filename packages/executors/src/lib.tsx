import { isMatch } from 'lodash-es';

import { RegistryEntry } from '../types';

type VariablesMatcher =
  | Record<string, any>
  | ((vars: Record<string, any>) => boolean);

function executorMap(executors: RegistryEntry[]) {
  return Object.fromEntries(
    executors.map((ex) => [`${ex.id}:${JSON.stringify(ex.variables)}`, ex]),
  );
}

export function mergeExecutors(
  oldExecutors: RegistryEntry[],
  newExecutors: RegistryEntry[],
): RegistryEntry[] {
  return Object.values(
    Object.assign({}, executorMap(oldExecutors), executorMap(newExecutors)),
  );
}

export function matchVariables(
  matcher: VariablesMatcher | undefined,
  variables: any,
) {
  if (typeof matcher === 'undefined') {
    return true;
  }
  if (typeof matcher === 'function') {
    return matcher(variables);
  }
  return isMatch(variables, matcher);
}

export function getCandidates(id: string, registry: RegistryEntry[]) {
  return (registry as Array<RegistryEntry>).filter(
    (entry) => id === entry.id || entry.id === undefined,
  );
}

function formatEntry(id: string | undefined, variables?: Record<string, any>) {
  return `${id ? id : '*'}:${variables ? JSON.stringify(variables) : '*'}`;
}

export class ExecutorRegistryError extends Error {
  constructor(
    registry: RegistryEntry[],
    id: string,
    variables?: Record<string, any>,
  ) {
    const candidates = getCandidates(id, registry);
    const candidatesMessage =
      candidates.length > 0
        ? [
            'Candidates:',
            ...candidates.map(({ id, variables }) =>
              formatEntry(id, variables),
            ),
          ]
        : [];
    super(
      [
        'No executor found for:',
        formatEntry(id, variables),
        ...candidatesMessage,
      ].join(' '),
    );
    this.name = 'ExecutorRegistryError';
  }
}

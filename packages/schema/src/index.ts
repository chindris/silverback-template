import {
  createExecutor as untypedCreateExecutor,
  registerExecutor as untypedRegisterExecutor,
} from '@amazeelabs/executors';

import type {
  AnyOperationId,
  OperationResult,
  OperationVariables,
} from './generated/index.js';

export { clearRegistry } from '@amazeelabs/executors';

export * from './generated/index.js';
export * from '@amazeelabs/scalars';

type Executor<OperationId extends AnyOperationId> =
  | OperationResult<OperationId>
  | ((
      id: OperationId,
      variables: OperationVariables<OperationId>,
    ) => OperationResult<OperationId> | Promise<OperationResult<OperationId>>);

type VariablesMatcher<OperationId extends AnyOperationId> =
  | Partial<OperationVariables<OperationId>>
  | ((vars: OperationVariables<OperationId>) => boolean);

export function registerExecutor<OperationId extends AnyOperationId>(
  executor: Executor<OperationId>,
): void;

export function registerExecutor<OperationId extends AnyOperationId>(
  id: OperationId,
  executor: Executor<OperationId>,
): void;

export function registerExecutor<OperationId extends AnyOperationId>(
  id: OperationId,
  variables: VariablesMatcher<OperationVariables<OperationId>>,
  executor: Executor<OperationId>,
): void;

export function registerExecutor(...args: [unknown]) {
  return untypedRegisterExecutor(...args);
}

export function createExecutor<OperationId extends AnyOperationId>(
  id: OperationId,
  variables?: OperationVariables<OperationId>,
):
  | OperationResult<OperationId>
  | (() => Promise<OperationResult<OperationId>>) {
  return untypedCreateExecutor(id, variables);
}

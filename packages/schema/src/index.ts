import {
  ExecuteOperation as UntypedExecuteOperation,
  OperationExecutor as UntypedOperationExecutor,
  useExecutor as untypedUseExecutor,
} from '@amazeelabs/executors';
import { PropsWithChildren } from 'react';

import type {
  AnyOperationId,
  OperationResult,
  OperationVariables,
} from './generated/index.js';

export * from './generated/index.js';
export * from '@amazeelabs/scalars';

export * from './locale.js';

type Executor<OperationId extends AnyOperationId> =
  | OperationResult<OperationId>
  | ((
      id: OperationId,
      variables: OperationVariables<OperationId>,
    ) => OperationResult<OperationId> | Promise<OperationResult<OperationId>>);

type VariablesMatcher<OperationId extends AnyOperationId> =
  | Partial<OperationVariables<OperationId>>
  | ((vars: OperationVariables<OperationId>) => boolean);

export function OperationExecutor<OperationId extends AnyOperationId>(
  props: PropsWithChildren<{
    id?: OperationId;
    variables?: VariablesMatcher<OperationVariables<OperationId>>;
    executor: Executor<OperationId>;
  }>,
): JSX.Element {
  return UntypedOperationExecutor(props);
}

export function ExecuteOperation<OperationId extends AnyOperationId>(props: {
  id: OperationId;
  variables?: OperationVariables<OperationId>;
  children: (result: {
    loading: boolean;
    result: OperationResult<OperationId>;
  }) => JSX.Element;
}): JSX.Element {
  return UntypedExecuteOperation(props) as JSX.Element;

}

export function useExecutor<OperationId extends AnyOperationId>(
  id: OperationId,
  variables?: OperationVariables<OperationId>,
):
  | OperationResult<OperationId>
  | ((
      variables?: OperationVariables<OperationId>,
    ) => Promise<OperationResult<OperationId>>) {
  return untypedUseExecutor(id, variables);
}

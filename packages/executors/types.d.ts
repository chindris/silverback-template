import { JSX, PropsWithChildren } from 'react';

type Executor =
  | any
  | ((id: string, variables: Record<string, any>) => any | Promise<any>);

type VariablesMatcher =
  | Record<string, any>
  | ((vars: Record<string, any>) => boolean);

export type RegistryEntry = {
  executor: Executor;
  id?: string;
  variables?: VariablesMatcher;
};

export function OperationExecutor(
  props: PropsWithChildren<RegistryEntry>,
): JSX.Element;

export function ExecuteOperation(props: {
  id: string;
  variables?: Record<string, any>;
  children: (result: { loading: boolean; result: any }) => JSX.Element;
}): JSX.Element | Promise<JSX.Element>;

export function useExecutor(
  id: string,
  variables?: Record<string, any>,
): (vars?: Record<string, any>) => any | Promise<any>;

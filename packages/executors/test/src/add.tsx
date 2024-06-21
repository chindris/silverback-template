import type { OperationId } from '@amazeelabs/codegen-operation-ids';

import type {
  Operation as ComponentType,
  OperationExecutorsProvider as ProviderType,
} from '../../src/interface.js';
import type { RegistryEntry } from '../../src/types.js';

export const AddOperation = 'add_two_numbers' as OperationId<
  { result: number },
  { a: number; b: number }
>;

export const HardcodedAdd: RegistryEntry<typeof AddOperation> = {
  id: AddOperation,
  executor: { result: 3 },
  variables: { a: 1, b: 2 },
};

export const ImmediateAdd: RegistryEntry<typeof AddOperation> = {
  id: AddOperation,
  executor: (_, { a, b }) => {
    return { result: a + b };
  },
  variables: { a: 1, b: 1 },
};

export const ErrorAdd: RegistryEntry<typeof AddOperation> = {
  id: AddOperation,
  executor: () => {
    throw 'I dont like zeros!';
  },
  variables: function Zero({ a, b }) {
    return a === 0 && b === 0;
  },
};

export const DelayedAdd: RegistryEntry<typeof AddOperation> = {
  executor: (_, { a, b }) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ result: a + b });
      }, 1000);
    }),
};

export function Calc({
  label,
  a,
  b,
  Operation,
}: {
  label: string;
  a: number;
  b: number;
  Operation: ComponentType;
}) {
  return (
    <Operation id={AddOperation} variables={{ a, b }}>
      {(props) => {
        if (props.state === 'loading') {
          return <p data-testid={label}>Loading...</p>;
        }
        if (props.state === 'error') {
          return <p data-testid={label}>Error: {`${props.error}`}</p>;
        }
        return (
          <p data-testid={label}>
            {label}: {a} + {b} = {props.data.result}
          </p>
        );
      }}
    </Operation>
  );
}

export function TestComponent({
  label,
  OperationExecutorsProvider,
  Operation,
}: {
  label: string;
  OperationExecutorsProvider: ProviderType;
  Operation: ComponentType;
}) {
  return (
    <OperationExecutorsProvider
      executors={[DelayedAdd, ErrorAdd, ImmediateAdd, HardcodedAdd]}
    >
      <h1>{label}</h1>
      <Calc label="Hardcoded" a={1} b={2} Operation={Operation} />
      <Calc label="Immediate" a={1} b={1} Operation={Operation} />
      <Calc label="Delayed" a={2} b={3} Operation={Operation} />
      <Calc label="Error" a={0} b={0} Operation={Operation} />
    </OperationExecutorsProvider>
  );
}

import {
  AnyOperationId,
  Operation,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import React from 'react';

export const withOperation = <TOperation extends AnyOperationId>(
  id: TOperation,
  Component: (props: OperationResult<TOperation>) => React.ReactNode,
) => {
  const wrapper = (props: OperationVariables<TOperation>) => {
    return (
      <Operation id={id} variables={props}>
        {(result) => {
          if (result.state === 'success') {
            return <Component {...result.data} />;
          }
          return <></>;
        }}
      </Operation>
    );
  };
  wrapper.displayName = `withOperation(${id})`;
  return wrapper;
};

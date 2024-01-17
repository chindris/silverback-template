import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
} from '@custom/schema';

declare module '@amazeelabs/gatsby-plugin-operations' {
  export const graphql: <OperationId extends AnyOperationId>(
    id: OperationId,
  ) => OperationResult<OperationId>;

  function useStaticQuery<Input extends any>(id: Input): Input;

  function graphqlQuery<OperationId extends AnyOperationId>(
    id: OperationId,
    vars?: OperationVariables<OperationId>,
  ): Promise<{
    data: OperationResult<OperationId>;
    errors?: Array<any>;
  }>;
}

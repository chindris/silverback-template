import { GraphQLFieldResolver } from 'graphql';

export const notAvailable: GraphQLFieldResolver<any, any> = (
  _,
  __,
  ___,
  info,
) => {
  throw new Error(
    `${info.parentType.name}.${info.fieldName} is not available in Decap.`,
  );
};

export const todo: GraphQLFieldResolver<any, any> = (_, __, ___, info) => {
  throw new Error(
    `${info.parentType.name}.${info.fieldName} is not yet implemented in Decap.`,
  );
};

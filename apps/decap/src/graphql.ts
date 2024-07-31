import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import { SourceResolvers } from '@custom/schema/source';
import merge from 'deepmerge';
import { readFileSync } from 'fs';
import {
  buildSchema,
  graphql,
  GraphQLFieldResolver,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
} from 'graphql';
import { z } from 'zod';

function isImageSource(type: GraphQLOutputType) {
  if (type instanceof GraphQLNonNull) {
    return isImageSource(type.ofType);
  }
  return type instanceof GraphQLScalarType && type.name === 'ImageSource';
}

export function createExecutor(
  registries: Array<SourceResolvers>,
  basePath: string = '.',
): <TOperation extends AnyOperationId>(
  operation: TOperation,
  variables: OperationVariables<TOperation>,
) => Promise<OperationResult<TOperation>> {
  const rawOperations = readFileSync(
    `${basePath}/node_modules/@custom/schema/build/operations.json`,
  ).toString();
  const rawSchema = readFileSync(
    `${basePath}/node_modules/@custom/schema/build/schema.graphql`,
  ).toString();
  const registry = merge.all(registries) as SourceResolvers;
  const schema: GraphQLSchema = buildSchema(rawSchema);
  const operations = z
    .record(z.string(), z.string())
    .parse(JSON.parse(rawOperations));

  return async (operation, variables) => {
    const result = await graphql({
      schema,
      source: operations[operation as keyof typeof operations],
      variableValues: variables,
      rootValue: {},
      fieldResolver: async (source, args, context, info) => {
        const resolver = registry[
          info.parentType.name as keyof SourceResolvers
        ]?.[info.fieldName as keyof SourceResolvers[keyof SourceResolvers]] as
          | GraphQLFieldResolver<any, any>
          | undefined;
        if (resolver) {
          try {
            const res = await resolver(source, args, context, info);
            return res;
          } catch (err) {
            console.error(err);
          }
        } else {
          if (isImageSource(info.returnType)) {
            return JSON.stringify({
              src: source[info.fieldName].replace('/apps/decap', ''),
            });
          } else {
            return source[info.fieldName];
          }
        }
      },
    });
    if (!result.data) {
      throw result.errors;
    }
    return JSON.parse(JSON.stringify(result.data));
  };
}
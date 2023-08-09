import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import {
  ImageSource,
  OperationId,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import { ContactSource } from '@custom/schema/source';
import { buildSchema, graphql, GraphQLFieldResolver } from 'graphql';
import { useEffect, useState } from 'react';

import operations from '../node_modules/@custom/schema/build/operations.json';
/*
TODO: Generalize schema concatenation for other use cases (e.g. Drupal or Gatsby).
Either using codegen or by reading .graphqlconfig.
*/
import rawSchema from '../node_modules/@custom/schema/src/schema.graphqls?raw';

const rawDirectives = import.meta.glob(
  '../node_modules/@custom/schema/src/generated/**/*.graphqls',
  { as: 'raw', eager: true },
);
const fullSchema = [...Object.values(rawDirectives), rawSchema].join('\n');
const schema = buildSchema(fullSchema);

type DecapContext = {
  getAssetUrl: (path: string) => string;
};

// TODO: build resolvers from directives.
const resolvers = {
  Contact: {
    portrait: (async (source, { width, height, sizes }, { getAssetUrl }) => {
      if (source.portrait) {
        const src = getAssetUrl(source.portrait);
        const { width: oWidth, height: oHeight } = await createImageBitmap(
          await (await fetch(src)).blob(),
        );
        return buildResponsiveImage(
          {
            cloudname: 'demo',
            key: 'demo',
            secret: 'demo',
          },
          { src, width: oWidth, height: oHeight },
          { width: width || oWidth, height, sizes },
        );
      }
    }) as GraphQLFieldResolver<
      ContactSource,
      DecapContext,
      { width?: number; height?: number; sizes?: [[number]] },
      Promise<ImageSource | undefined>
    >,
  },
} as Record<string, Record<string, GraphQLFieldResolver<any, any>>>;

export async function query<TOperation extends OperationId<any, any>>(
  operation: TOperation,
  rootValue: any,
  variables: OperationVariables<TOperation> = {},
  getAssetUrl: (path: string) => string,
): Promise<OperationResult<TOperation>> {
  const result = await graphql({
    schema,
    source: operations[operation as keyof typeof operations],
    rootValue,
    contextValue: { getAssetUrl },
    variableValues: variables,
    fieldResolver: (source, args, context, info) => {
      return resolvers[info.parentType.name]?.[info.fieldName]
        ? resolvers[info.parentType.name][info.fieldName](
            source,
            args,
            context,
            info,
          )
        : source[info.fieldName];
    },
  });
  if (!result.data) {
    throw result.errors;
  }
  return result.data;
}

export function useQuery<TOperation extends OperationId<any, any>>(
  operation: TOperation,
  rootValue: any,
  variables: OperationVariables<TOperation> = {},
  getAssetUrl: (path: string) => string,
) {
  const [result, setResult] = useState<OperationResult<TOperation>>();
  const [key, setKey] = useState('');
  useEffect(() => {
    if (key !== JSON.stringify({ operation, rootValue, variables })) {
      query(operation, rootValue, variables, getAssetUrl)
        .then(setResult)
        .catch(console.error);
      setKey(JSON.stringify({ operation, rootValue, variables }));
    }
  }, [
    operation,
    rootValue,
    variables,
    getAssetUrl,
    result,
    setResult,
    key,
    setKey,
  ]);
  return result;
}

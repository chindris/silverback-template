import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/schema.graphqls',
  documents: ['src/fragments/**/*.gql', 'src/operations/**/*.gql'],
  generates: {
    // Persisted query ids to be consumed by Drupal.
    'build/operations.json': {
      plugins: ['@amazeelabs/codegen-operation-ids'],
    },
    // All fragments collected into one javascript file for Gatsby.
    'build/gatsby-fragments.js': {
      plugins: ['@amazeelabs/codegen-gatsby-fragments'],
    },
    // The main entry point. Contains:
    // - All types generated from the schema.
    // - All operation types
    // - All fragment types
    // - All operations as typed id's
    'build/index.ts': {
      plugins: [
        {
          typescript: {
            enumsAsConst: true,
          },
        },
        `typescript-operations`,
        '@amazeelabs/codegen-operation-ids',
      ],
      config: {
        maybeValue: 'T | undefined',
        strictScalars: true,
        scalars: {
          Markup: '@amazeelabs/scalars#Markup',
          Url: '@amazeelabs/scalars#Url',
          ImageSource: '@amazeelabs/scalars#ImageSource',
        },
        withObjectType: true,
        // Only add __typename to types if it is explicitly specified in the
        // query.
        skipTypename: true,
      },
    },
  },
};

export default config;

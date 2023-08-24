import type { CodegenConfig } from '@graphql-codegen/cli';

const common = {
  enumsAsConst: true,
  maybeValue: 'T | undefined',
  strictScalars: true,
  scalars: {
    Markup: '@amazeelabs/scalars#Markup',
    Url: '@amazeelabs/scalars#Url',
    ImageSource: '@amazeelabs/scalars#ImageSource',
  },
  withObjectType: true,
};

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
    'src/generated.ts': {
      plugins: [
        `typescript`,
        `typescript-operations`,
        '@amazeelabs/codegen-operation-ids',
      ],
      config: {
        ...common,
        // Only add __typename to types if it is explicitly specified in the
        // query.
        skipTypename: true,
      },
    },
    // Source type definitions.
    // All graphql schema types, suffixed with `Source` and with required
    // type names. Used for validating incoming data, e.g. from Decap.
    'build/source.ts': {
      plugins: [`typescript`],
      config: {
        ...common,
        typesSuffix: 'Source',
        // In source types we always want an enforced __typename, so unions and
        // interfaces can be resolved automatically.
        skipTypename: false,
        nonOptionalTypename: true,
      },
    },
  },
};

export default config;

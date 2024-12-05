import { base, defineConfig } from '@custom/eslint-config';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';

export default defineConfig([
  ...base,
  {
    ignores: ['src/generated/**', 'build/**'],
  },
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig: {
          schema: ['./src/schema.graphql', './src/directives.graphql'],
          documents: '../../tests/schema/specs/*.ts',
        },
      },
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      '@graphql-eslint/no-unused-fields': 'warn',
    },
  },
]);

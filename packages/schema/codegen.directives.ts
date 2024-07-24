import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    'node_modules/@amazeelabs/*/directives.graphql',
    '../../apps/cms/web/modules/contrib/*/directives.graphql',
    '../../apps/cms/web/modules/custom/*/directives.graphql',
  ],
  generates: {
    'src/directives.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;

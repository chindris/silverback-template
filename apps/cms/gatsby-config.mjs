import autoload from '@custom/schema/gatsby-autoload';

process.env.GATSBY_DRUPAL_URL =
  process.env.DRUPAL_EXTERNAL_URL || 'http://127.0.0.1:8888';

/**
 * @type {import('gatsby').GatsbyConfig['plugins']}
 */
export const plugins = [
  {
    resolve: '@amazeelabs/gatsby-source-silverback',
    options: {
      schema_configuration: './graphqlrc.yml',
      directives: autoload,
      drupal_url: process.env.DRUPAL_INTERNAL_URL || 'http://127.0.0.1:8888',
      drupal_external_url:
        // File requests are proxied through netlify.
        process.env.NETLIFY_URL || 'http://127.0.0.1:8000',
      graphql_path: '/graphql',
      auth_key: 'cfdb0555111c0f8924cecab028b53474',
      type_prefix: '',
    },
  },
];

/**
 * @type {import('gatsby').GatsbyConfig}
 */
export default {
  proxy: {
    prefix: '/sites/default/files',
    url: process.env.DRUPAL_EXTERNAL_URL || 'http://127.0.0.1:8888',
  },
  plugins,
};

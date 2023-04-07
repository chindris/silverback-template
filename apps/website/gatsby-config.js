/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  flags: {
    PARTIAL_HYDRATION: true,
  },
  plugins: [
    {
      resolve: '@amazeelabs/gatsby-source-silverback',
      options: {
        drupal_url: 'http://127.0.0.1:8888', // TODO: Use env var.
        graphql_path: '/graphql',
        auth_key: 'cfdb0555111c0f8924cecab028b53474',
        type_prefix: '',
      },
    },
  ],
};

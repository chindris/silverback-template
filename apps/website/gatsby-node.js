const { readFileSync } = require('fs');
const path = require('path');

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
const createSchemaCustomization = (args) => {
  // TODO: This is still necessary, because graphql-source-toolkit won't import
  //       interface relations.
  const schema = readFileSync(
    `./node_modules/@custom/schema/src/schema.graphqls`,
    'utf8',
  ).toString();
  args.actions.createTypes(schema);
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
const onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@amazeelabs/bridge': path.resolve(__dirname, '/src/bridge/'),
      },
    },
  });
};

module.exports = {
  createSchemaCustomization,
  onCreateWebpackConfig,
};

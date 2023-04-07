const { readFileSync } = require('fs');

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

module.exports = {
  createSchemaCustomization,
};

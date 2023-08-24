// import { ListDecapPagesQuery } from '@custom/schema';
import operations from '@custom/schema/operations' assert { type: 'json' };
import { readFileSync } from 'fs';
/**
 * @type {import('gatsby').GatsbyNode['sourceNodes']}
 */
export const sourceNodes = async ({
  createNodeId,
  createContentDigest,
  actions: { createNode },
}) => {
  const items = (await import('@custom/decap'))['getPages']();
  items.forEach((item) => {
    createNode(
      Object.assign({}, item, {
        id: createNodeId(item.id),
        parent: null,
        children: [],
        internal: {
          type: 'DecapPageNode',
          content: JSON.stringify(item),
          contentDigest: createContentDigest(item),
        },
      }),
    );
  });
};

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
export const createPages = async ({ actions: { createPage } }) => {
  console.log(operations);
  // const query = operations[ListDecapPagesQuery];
  // console.log(query);
};

/**
 * @type {import('gatsby').GatsbyNode['createResolvers']}
 */
export const createResolvers = (args) => {
  args.createResolvers({
    Query: {
      listDecapPages: {
        resolve: async (source, args, context) => {
          return (
            await context.nodeModel.findAll({
              type: 'DecapPageNode',
            })
          ).entries;
        },
      },
      fetchDecapPage: {
        resolve: async (source, args, context) => {
          return (
            await context.nodeModel.findOne({
              type: 'DecapPageNode',
              query: {
                filter: {
                  id: {
                    eq: args.id,
                  },
                },
              },
            })
          ).entries;
        },
      },
    },
  });
};

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
export const createSchemaCustomization = (args) => {
  const schema = readFileSync(
    `./node_modules/@custom/schema/src/schema.graphqls`,
    'utf8',
  ).toString();
  args.actions.createTypes(schema);

  // Create field extensions for all directives that could confuse Gatsby.
  const directives = schema.matchAll(/ @[a-zA-Z][a-zA-Z0-9]*/gm);
  const directiveNames = new Set();
  // "default" is a gatsby internal directive and should not be added again.
  directiveNames.add('default');
  for (const directive of directives) {
    const name = directive[0].substring(2);
    if (!directiveNames.has(name)) {
      directiveNames.add(name);
      args.actions.createFieldExtension({ name });
    }
  }
};

import { Locale } from '@custom/schema';
import operations from '@custom/schema/operations' assert { type: 'json' };
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
export const onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@amazeelabs/bridge': '@amazeelabs/bridge-gatsby',
      },
    },
  });
};

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
export const createPages = async ({ actions, graphql }) => {
  // Rewrite file requests to Drupal.
  actions.createRedirect({
    fromPath: '/sites/default/files/*',
    toPath: `${process.env.GATSBY_DRUPAL_URL}/sites/default/files/:splat`,
    statusCode: 200,
  });

  actions.createRedirect({
    fromPath: '/graphql',
    toPath: `${process.env.GATSBY_DRUPAL_URL}/graphql`,
    statusCode: 200,
  });

  const settings = await graphql(`
    query IndexPages {
      websiteSettings {
        homePage {
          translations {
            typeName: __typename
            locale
            id
            remoteId
            path
          }
        }
        notFoundPage {
          translations {
            path
          }
        }
      }
    }
  `);

  if (settings.errors) {
    throw settings.errors;
  }

  if (settings.data?.websiteSettings?.homePage) {
    const frontPageLocalizations =
      settings.data?.websiteSettings?.homePage.translations.map(
        ({ locale }) => ({
          path: `/${locale}`,
          locale,
        }),
      );

    settings.data?.websiteSettings?.homePage.translations.forEach(
      ({ locale, typeName, id, remoteId, path }) => {
        // Create a page at the "front" path.
        const frontPath =
          frontPageLocalizations.length > 1 ? `/${locale}` : '/';
        actions.createPage({
          path: frontPath,
          component: resolve(`./src/templates/page.tsx`),
          context: {
            typeName,
            id,
            remoteId,
            locale,
            localizations:
              frontPageLocalizations.length > 1 ? frontPageLocalizations : [],
          },
        });
        // Delete the page at the original path.
        actions.deletePage({
          path,
          component: resolve(`./src/templates/page.tsx`),
        });
        // Create a redirect from the original path to the "front" path.
        actions.createRedirect({
          fromPath: path,
          toPath: frontPath,
          isPermanent: true,
          force: true,
        });
      },
    );
  }

  // Remove 404 pages. We handle them in src/pages/404.tsx
  settings.data?.websiteSettings?.notFoundPage?.translations.forEach(
    ({ path }) => {
      actions.deletePage({
        path,
        component: resolve(`./src/templates/page.tsx`),
      });
    },
  );

  // Broken Gatsby links will attempt to load page-data.json files, which don't exist
  // and also should not be piped into the strangler function. Thats why they
  // are caught right here.
  actions.createRedirect({
    fromPath: '/page-data/*',
    toPath: '/404',
    statusCode: 404,
  });

  // Proxy Drupal webforms.
  Object.values(Locale).forEach((locale) => {
    actions.createRedirect({
      fromPath: `/${locale}/form/*`,
      toPath: `${process.env.GATSBY_DRUPAL_URL}/${locale}/form/:splat`,
      statusCode: 200,
    });
  });
  // Additionally proxy themes and modules as they can have additional
  // non-aggregated assets.
  ['themes', 'modules'].forEach((path) => {
    actions.createRedirect({
      fromPath: `/${path}/*`,
      toPath: `${process.env.GATSBY_DRUPAL_URL}/${path}/:splat`,
      statusCode: 200,
    });
  });

  // Any unhandled requests are handed to strangler, which will try to pass
  // them to all registered legacy systems and return 404 if none of them
  // respond.
  actions.createRedirect({
    fromPath: '/*',
    toPath: `/.netlify/functions/strangler`,
    statusCode: 200,
  });

  // Generate decap pages.
  console.log(operations);
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
              type: 'DecapPage',
            })
          ).entries;
        },
      },
      fetchDecapPage: {
        resolve: async (source, args, context) => {
          return (
            await context.nodeModel.findOne({
              type: 'DecapPage',
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

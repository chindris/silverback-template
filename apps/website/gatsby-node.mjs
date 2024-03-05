import { graphqlQuery } from '@amazeelabs/gatsby-plugin-operations';
import {
  HomePageQuery,
  ListPagesQuery,
  Locale,
  NotFoundPageQuery,
} from '@custom/schema';
import { resolve } from 'path';

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
 * @template T extends any
 * @param {T | undefined | null} val
 * @returns {val is T}
 */
function isDefined(val) {
  return Boolean(val);
}

/**
 *
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
export const createPages = async ({ actions }) => {
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

  // Grab Home- and 404 pages.
  const homePages =
    (
      await graphqlQuery(HomePageQuery)
    ).data.websiteSettings?.homePage?.translations?.filter(isDefined) || [];
  const notFoundPages =
    (
      await graphqlQuery(NotFoundPageQuery)
    ).data.websiteSettings?.notFoundPage?.translations?.filter(isDefined) || [];

  // Create pages and root-redirects for home-pages.
  homePages.forEach((page) => {
    actions.createPage({
      path: `/${page.locale}`,
      component: resolve('./src/templates/home.tsx'),
    });
    // If a menu link points to the drupal-path of a home page,
    // it should redirect to the root path with the language prefix.
    actions.createRedirect({
      fromPath: page.path,
      toPath: `/${page.locale}`,
      statusCode: 301,
    });
  });

  // Create a list of paths that we don't want to render regularly.
  // 404 and homepages are dealt with differrently.
  const skipPaths = [
    ...(homePages.map((page) => page.path) || []),
    ...(notFoundPages.map((page) => page.path) || []),
  ];

  // Run the query that lists all pages, both decap and Drupal.
  const pages = await graphqlQuery(ListPagesQuery);

  // Create a gatsby page for each of these pages.
  pages.data?.allPages
    ?.filter(isDefined)
    .filter((page) => !skipPaths.includes(page.path))
    .forEach(({ path }) => {
      actions.createPage({
        path: path,
        component: resolve(`./src/templates/page.tsx`),
        context: { pathname: path },
      });
    });

  // Create the content hub page in each language.
  Object.values(Locale).forEach((locale) => {
    actions.createPage({
      path: `/${locale}/content-hub`,
      component: resolve(`./src/templates/content-hub.tsx`),
    });
  });

  // Create a contact page in each language.
  Object.values(Locale).forEach((locale) => {
    actions.createPage({
      path: `/${locale}/contact`,
      component: resolve(`./src/templates/contact.tsx`),
    });
  });

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
};

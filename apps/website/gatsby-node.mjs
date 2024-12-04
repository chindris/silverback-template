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
  // 404 and homepages are dealt with differently.
  const skipPaths = [
    ...(homePages.map((page) => page.path) || []),
    ...(notFoundPages.map((page) => page.path) || []),
  ];

  // Run the query that lists all pages, both Decap and Drupal.
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

  // Create a inquiry page in each language.
  Object.values(Locale).forEach((locale) => {
    actions.createPage({
      path: `/${locale}/inquiry`,
      component: resolve(`./src/templates/inquiry.tsx`),
    });
  });

  // Create a profile page in each language.
  Object.values(Locale).forEach((locale) => {
    actions.createPage({
      path: `/${locale}/profile`,
      component: resolve(`./src/templates/profile.tsx`),
    });
  });
};

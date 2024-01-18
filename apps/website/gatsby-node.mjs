import { graphqlQuery } from '@amazeelabs/gatsby-plugin-operations';
import { IndexPagesQuery, ListPagesQuery, Locale } from '@custom/schema';
import { cpSync } from 'fs';
import { resolve } from 'path';
import serve from 'serve-static';

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

  // Run the query that lists all pages, both decap and Drupal.
  const pages = await graphqlQuery(ListPagesQuery);

  // Create a gatsby page for each of these pages.
  pages.data?.allPages?.filter(isDefined).forEach(({ id, path, locale }) => {
    const context = {
      id,
      locale,
    };
    actions.createPage({
      path: path,
      component: resolve(`./src/templates/page.tsx`),
      context,
    });
  });

  // Search for index page settings.
  const settings = await graphqlQuery(IndexPagesQuery);

  if (settings.errors) {
    settings.errors.map((e) => console.error(e));
    throw settings.errors;
  }

  if (settings.data?.websiteSettings?.homePage) {
    const frontPageLocalizations =
      settings.data?.websiteSettings?.homePage.translations
        ?.filter(isDefined)
        .map(({ locale }) => ({
          path: `/${locale}`,
          locale,
        })) || [];

    settings.data?.websiteSettings?.homePage.translations
      ?.filter(isDefined)
      .forEach(({ locale, id, path }) => {
        // Create a page at the "front" path.
        const frontPath =
          frontPageLocalizations.length > 1 ? `/${locale}` : '/';
        const context = {
          id,
          locale,
          localizations:
            frontPageLocalizations.length > 1 ? frontPageLocalizations : [],
        };
        actions.createPage({
          path: frontPath,
          component: resolve(`./src/templates/page.tsx`),
          context,
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
      });
  }

  // Remove 404 pages. We handle them in src/pages/404.tsx
  settings.data?.websiteSettings?.notFoundPage?.translations
    ?.filter(isDefined)
    .forEach(({ path }) => {
      actions.deletePage({
        path,
        component: resolve(`./src/templates/page.tsx`),
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

// TODO: Move to shared package.
/**
 * @type Record<string, string>
 */
const staticDirectories = {
  'node_modules/@custom/ui/static/public': '/',
  'node_modules/@custom/decap/dist': '/admin',
  'node_modules/@custom/decap/media': '/media',
};

/**
 * @type {import('gatsby').GatsbyNode['onPostBuild']}
 */
export const onPostBuild = () => {
  Object.keys(staticDirectories).forEach((src) => {
    const dest = staticDirectories[src];
    cpSync(src, `public${dest}`, { force: true, recursive: true });
  });
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateDevServer']}
 */
export const onCreateDevServer = ({ app }) => {
  Object.keys(staticDirectories).forEach((src) => {
    const dest = staticDirectories[src];
    app.use(dest, serve(src));
  });
};

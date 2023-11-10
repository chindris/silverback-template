// @ts-check
import { Locale } from '@custom/schema';
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
 *
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

  /**
   * @type {{
   *   data?: {
   *     websiteSettings?: {
   *       homePage?: {
   *         translations: Array<{
   *           typeName: string;
   *           path: string;
   *           locale: string;
   *           id: string;
   *           remoteId: string;
   *         }>;
   *       };
   *       notFoundPage?: {
   *         translations: Array<{
   *           path: string;
   *         }>;
   *       };
   *     };
   *   };
   *   errors?: any[];
   * }}
   */
  const settings = await graphql(`
    query IndexPages {
      websiteSettings {
        homePage {
          translations: _translations {
            typeName: __typename
            locale
            id: _id
            remoteId: _id
            path
          }
        }
        notFoundPage {
          translations: _translations {
            path
          }
        }
      }
    }
  `);

  if (settings.errors) {
    settings.errors.map((e) => console.error(e));
    throw settings.errors;
  }

  if (settings.data?.websiteSettings?.homePage) {
    /**
     * @type {import('@amazeelabs/gatsby-source-silverback').SilverbackPageContext['localizations']}
     */
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
        /**
         * @type {import('@amazeelabs/gatsby-source-silverback').SilverbackPageContext}
         */
        const context = {
          typeName,
          id,
          remoteId,
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
};

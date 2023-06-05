import type { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { readFileSync } from 'fs';
import { GatsbyNode } from 'gatsby';
import { resolve } from 'path';

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  (args) => {
    // TODO: This is still necessary, because graphql-source-toolkit won't import
    //       interface relations.
    const schema = readFileSync(
      `./node_modules/@custom/schema/src/schema.graphqls`,
      'utf8',
    ).toString();
    args.actions.createTypes(schema);
    [
      'fetchEntity',
      'imageProps',
      'isPath',
      'lang',
      'resolveEditorBlockAttribute',
      'resolveEditorBlockChildren',
      'resolveEditorBlockMarkup',
      'resolveEditorBlockMedia',
      'resolveEditorBlocks',
      'resolveEntityLanguage',
      'resolveEntityPath',
      'resolveEntityReference',
      'resolveMenuItemId',
      'resolveMenuItemLabel',
      'resolveMenuItemParentId',
      'resolveMenuItemUrl',
      'resolveMenuItems',
      'resolveProperty',
      'responsiveImage',
      'seek',
    ].forEach((name) => {
      args.actions.createFieldExtension({ name });
    });
  };

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@amazeelabs/bridge': '@amazeelabs/bridge-gatsby',
      },
    },
  });
};

export const createPages: GatsbyNode['createPages'] = async ({
  actions,
  graphql,
}) => {
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

  const settings = await graphql<{
    websiteSettings?: {
      homePage?: {
        translations: Array<{
          typeName: string;
          path: string;
          locale: string;
          id: string;
          remoteId: string;
        }>;
      };
    };
  }>(`
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
      ) satisfies SilverbackPageContext['localizations'];

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
          } satisfies SilverbackPageContext,
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

  // Any unhandled requests are handed to strangler, which will try to pass
  // them to all registered legacy systems and return 404 if none of them
  // respond.
  actions.createRedirect({
    fromPath: '/*',
    toPath: `/.netlify/functions/strangler`,
    statusCode: 200,
  });
};

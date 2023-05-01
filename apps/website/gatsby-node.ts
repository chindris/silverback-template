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
  };

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@amazeelabs/bridge': resolve(__dirname, '/src/bridge/'),
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
        actions.createPage({
          path: `/${locale}`,
          component: resolve(`./src/templates/page.tsx`),
          context: {
            typeName,
            id,
            remoteId,
            locale,
            localizations: frontPageLocalizations,
          } satisfies SilverbackPageContext,
        });

        actions.createRedirect({
          fromPath: path,
          toPath: `/${locale}`,
          isPermanent: true,
          force: true,
        });
      },
    );
  }
};

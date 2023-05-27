import type { SilverbackPageContext } from '@amazeelabs/gatsby-source-silverback';
import { readFileSync } from 'fs';
import { GatsbyNode } from 'gatsby';
import { GatsbyIterable } from 'gatsby/dist/datastore/common/iterable';
import { resolve } from 'path';

import originalTranslationSources from './generated/translatables.json';


export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] =
  (args) => {
    // TODO: This is still necessary, because graphql-source-toolkit won't import
    //       interface relations.
    const schema = readFileSync(
      `./node_modules/@custom/schema/src/schema.graphqls`,
      'utf8',
    ).toString();
    args.actions.createTypes(schema);

    args.actions.createTypes(`
    type StringTranslation {
      id: String!
      message: String!
    }
    `);
  };

const sourceTranslations = originalTranslationSources as {
  [key: string]: {
    defaultMessage: string;
    description?: string;
  };
};

const idMap: Record<string, string> = {};

function mapKey(message: string, description: string) {
  return `${message}::${description}`;
}

Object.keys(sourceTranslations).forEach((key) => {
  idMap[
    mapKey(
      sourceTranslations[key].defaultMessage,
      sourceTranslations[key].description || '',
    )
  ] = key;
});

export const createResolvers: GatsbyNode['createResolvers'] = ({
  createResolvers,
}) => {
  createResolvers({
    Query: {
      stringTranslations: {
        type: ['StringTranslation!'],
        args: {
          locale: 'String!',
        },
        resolve: async (
          source: any,
          args: { locale: string },
          context: any,
        ) => {
          const {
            entries,
          }: {
            entries: GatsbyIterable<{
              source: string;
              context: string;
              translations: Array<{
                langcode: string;
                translation: string;
              }>;
            }>;
          } = await context.nodeModel.findAll({
            type: 'GatsbyStringTranslation',
          });

          return (
            entries
              .map((entry) => {
                const description = entry.context.replace(/^gatsby:? ?/, '');
                const id = idMap[mapKey(entry.source, description)];

                const message =
                  entry.translations
                    .filter((trans) => trans.langcode === args.locale)
                    .pop()?.translation || entry.source;
                return {
                  id,
                  message,
                };
              })
              // An empty ID means a translation string was changed, still
              // exists in Drupal, but not in the UI anymore. Filter those out.
              .filter((entry) => !!entry.id)
          );
        },
      },
    },
  });
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

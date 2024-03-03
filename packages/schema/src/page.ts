import { GraphQLFieldResolver } from 'graphql';

import { DecapPageSource } from './generated/source';

// TODO: Generate typing helpers to make this easier.
// TODO: Move these into a shared package that implements Drupals "graphql_directives" for Gatsby.

const internalTypes = ['Site', 'SiteBuildMetadata', 'SitePage', 'SitePlugin'];

export const loadEntity: GraphQLFieldResolver<URL, { nodeModel: any }> = async (
  url,
  _,
  { nodeModel },
) => {
  const types = nodeModel.getTypes();
  for (const type of types) {
    // Skip Gatsby internal types.
    if (internalTypes.includes(type)) {
      continue;
    }
    try {
      const result = await nodeModel.findOne({
        type,
        query: { filter: { path: { eq: url.pathname } } },
      });
      if (result) {
        return result;
      }
    } catch (e) {
      // Ignore:
      // Gatsby breaks when trying to query a field that
      // does not exist on the current type.
      // TODO: Probably a better solution would be to always
      //       restrict "loadEntity" by type. But then we need
      //       to make that change in Drupal too.
    }
  }
};

export const route: GraphQLFieldResolver<
  undefined,
  { nodeModel: any },
  { path: string }
> = (_, { path }) => {
  try {
    return new URL(path, process.env.NETLIFY_URL || 'https://localhost:8000');
  } catch (e) {
    console.warn(`Invalid url "${path}".`);
    console.warn(e);
    return new URL('/', process.env.NETLIFY_URL || 'https://localhost:8000');
  }
};

export const decapTranslations: GraphQLFieldResolver<
  DecapPageSource & { _decap_id: string },
  { nodeModel: any }
> = async (page, _, { nodeModel }) => {
  return (
    await nodeModel.findAll({
      type: 'DecapPage',
      query: { filter: { _decap_id: { eq: page._decap_id } } },
    })
  ).entries;
};

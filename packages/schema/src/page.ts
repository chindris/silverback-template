import { GraphQLFieldResolver } from 'graphql';

// TODO: Generate typing helpers to make this easier.
export const pageByPath: GraphQLFieldResolver<
  undefined,
  { nodeModel: any },
  { path: string }
> = async (_, { path }, { nodeModel }) => {
  return await nodeModel.findOne({
    type: 'Page',
    query: { filter: { path: { eq: path } } },
  });
};

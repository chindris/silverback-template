import { PluginObj, PluginPass, types } from '@babel/core';

export default () =>
  ({
    visitor: {
      ImportDeclaration(path, { opts }) {
        if (path.node.source.value !== '@amazeelabs/gatsby-operations') {
          path.replaceWith(
            types.importDeclaration(
              path.node.specifiers,
              types.stringLiteral('gatsby'),
            ),
          );
        }
      },
    },
  } as PluginObj<
    PluginPass & {
      opts: {
        operations: Record<string, string>;
      };
    }
  >);

import autoload from '@custom/schema/gatsby-autoload';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import * as sources from './build/index.js';

const dir = resolve(dirname(fileURLToPath(import.meta.url)));

/**
 * @type {import('gatsby').GatsbyConfig['plugins']}
 */
export const plugins = [
  {
    resolve: '@amazeelabs/gatsby-source-silverback',
    options: {
      schema_configuration: './graphqlrc.yml',
      directives: autoload,
      sources,
    },
  },
  {
    resolve: '@amazeelabs/gatsby-plugin-static-dirs',
    options: {
      directories: {
        [`${dir}/dist`]: '/admin',
        [`${dir}/media`]: '/media',
      },
    },
  },
];

export default { plugins };

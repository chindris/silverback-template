import { pluginTester } from 'babel-plugin-tester';

import plugin from './plugin';

pluginTester({
  plugin,
  pluginOptions: {},
  tests: [
    {
      code: `
import { MyOperation } from '@custom/schema';
import { useStaticQuery } from '@amazeelabs/gatsby-operations';
function useData() { return useStaticQuery(MyOperation); }
`,
      output: `
import { MyOperation } from '@custom/schema';
import { graphql, useStaticQuery, } from 'gatsby';
function useData() { return useStaticQuery(graphql\`{ field }\`); }
`,
    },
  ],
});

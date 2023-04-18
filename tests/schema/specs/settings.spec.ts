import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from './lib';

test('Page', async () => {
  const result = await fetch(gql`
    {
      loadWebsiteSettings(id: "1efc98ca-5548-425e-a3a1-42f8fc193956") {
        homePage {
          __typename
        }
        notFoundPage {
          __typename
        }
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadWebsiteSettings": {
          "homePage": {
            "__typename": "Page",
          },
          "notFoundPage": {
            "__typename": "Page",
          },
        },
      },
    }
  `);
});

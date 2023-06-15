import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from './lib';

test('Page', async () => {
  const result = await fetch(gql`
    fragment Page on Page {
      title
      path
      locale
      hero {
        __typename
      }
      content {
        __typename
      }
      translations {
        __typename
        locale
      }
    }
    {
      complete: loadPage(id: "ef80e284-154b-41fd-9317-154b0a175299") {
        ...Page
      }
      minimal: loadPage(id: "17626bb4-557f-48fc-b869-ae566f4ceae6") {
        ...Page
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "complete": {
          "content": [
            {
              "__typename": "BlockText",
            },
            {
              "__typename": "BlockImage",
            },
          ],
          "hero": {
            "__typename": "Hero",
          },
          "locale": "en",
          "path": "/en/page-complete",
          "title": "Page: complete",
          "translations": [
            {
              "__typename": "Page",
              "locale": "en",
            },
            {
              "__typename": "Page",
              "locale": "de",
            },
          ],
        },
        "minimal": {
          "content": [
            {
              "__typename": "BlockText",
            },
          ],
          "hero": {
            "__typename": "Hero",
          },
          "locale": "en",
          "path": "/en/page-minimal",
          "title": "Page: minimal",
          "translations": [
            {
              "__typename": "Page",
              "locale": "en",
            },
          ],
        },
      },
    }
  `);
});

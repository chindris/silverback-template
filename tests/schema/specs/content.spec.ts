import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from './lib';

test('Page', async () => {
  const result = await fetch(gql`
    fragment Page on Page {
      locale
      path
      title
      teaserImage {
        __typename
      }
      hero {
        __typename
      }
      content {
        __typename
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
              "__typename": "BlockMarkup",
            },
            {
              "__typename": "BlockMedia",
            },
          ],
          "hero": {
            "__typename": "Hero",
          },
          "locale": "en",
          "path": "/en/page-complete",
          "teaserImage": {
            "__typename": "MediaImage",
          },
          "title": "Page: complete",
        },
        "minimal": {
          "content": [
            {
              "__typename": "BlockMarkup",
            },
          ],
          "hero": {
            "__typename": "Hero",
          },
          "locale": "en",
          "path": "/en/page-minimal",
          "teaserImage": null,
          "title": "Page: minimal",
        },
      },
    }
  `);
});

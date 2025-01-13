import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from '../lib.js';

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
      metaTags {
        tag
        attributes {
          name
          content
          property
          rel
          href
        }
      }
    }
    {
      complete: _loadDrupalPage(id: "ef80e284-154b-41fd-9317-154b0a175299") {
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
          "metaTags": [
            {
              "attributes": {
                "content": "Page: complete | Silverback Drupal Template",
                "href": null,
                "name": "title",
                "property": null,
                "rel": null,
              },
              "tag": "meta",
            },
            {
              "attributes": {
                "content": null,
                "href": "http://127.0.0.1:8000/en/page-complete",
                "name": null,
                "property": null,
                "rel": "canonical",
              },
              "tag": "link",
            },
          ],
          "path": "/en/page-complete",
          "teaserImage": {
            "__typename": "MediaImage",
          },
          "title": "Page: complete",
        },
      },
    }
  `);
});

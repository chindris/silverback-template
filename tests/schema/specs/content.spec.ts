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
      minimal: _loadDrupalPage(id: "17626bb4-557f-48fc-b869-ae566f4ceae6") {
        ...Page
      }
      seo_all_empty: _loadDrupalPage(id: "5f108e07-62ca-4025-adca-069b3adfc22c") {
        translations {
          ...Page
        }
      }
      seo_all_filled_in: _loadDrupalPage(id: "6344bdc5-1b02-4542-b4ae-4e6df23b3e4c") {
        translations {
          ...Page
        }
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
          "metaTags": [
            {
              "attributes": {
                "content": "Page: minimal | Silverback Drupal Template",
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
                "href": "http://127.0.0.1:8000/en/page-minimal",
                "name": null,
                "property": null,
                "rel": "canonical",
              },
              "tag": "link",
            },
          ],
          "path": "/en/page-minimal",
          "teaserImage": null,
          "title": "Page: minimal",
        },
        "seo_all_empty": {
          "translations": [
            {
              "content": [
                {
                  "__typename": "BlockMarkup",
                },
              ],
              "hero": {
                "__typename": "Hero",
              },
              "locale": "en",
              "metaTags": [
                {
                  "attributes": {
                    "content": "SEO test - all empty | Silverback Drupal Template",
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
                    "href": "http://127.0.0.1:8000/en/seo-test-all-empty",
                    "name": null,
                    "property": null,
                    "rel": "canonical",
                  },
                  "tag": "link",
                },
              ],
              "path": "/en/seo-test-all-empty",
              "teaserImage": null,
              "title": "SEO test - all empty",
            },
            {
              "content": [
                {
                  "__typename": "BlockMarkup",
                },
              ],
              "hero": {
                "__typename": "Hero",
              },
              "locale": "de",
              "metaTags": [
                {
                  "attributes": {
                    "content": "SEO test - all empty DE | Silverback Drupal Template",
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
                    "href": "http://127.0.0.1:8000/de/seo-test-all-empty-de",
                    "name": null,
                    "property": null,
                    "rel": "canonical",
                  },
                  "tag": "link",
                },
              ],
              "path": "/de/seo-test-all-empty-de",
              "teaserImage": null,
              "title": "SEO test - all empty DE",
            },
          ],
        },
        "seo_all_filled_in": {
          "translations": [
            {
              "content": [
                {
                  "__typename": "BlockMarkup",
                },
              ],
              "hero": {
                "__typename": "Hero",
              },
              "locale": "en",
              "metaTags": [
                {
                  "attributes": {
                    "content": "Overwritten SEO title | Silverback Drupal Template",
                    "href": null,
                    "name": "title",
                    "property": null,
                    "rel": null,
                  },
                  "tag": "meta",
                },
                {
                  "attributes": {
                    "content": "SEO description",
                    "href": null,
                    "name": "description",
                    "property": null,
                    "rel": null,
                  },
                  "tag": "meta",
                },
                {
                  "attributes": {
                    "content": null,
                    "href": "http://127.0.0.1:8000/en/seo-test-all-filled",
                    "name": null,
                    "property": null,
                    "rel": "canonical",
                  },
                  "tag": "link",
                },
                {
                  "attributes": {
                    "content": null,
                    "href": "/sites/default/files/2024-04/the_silverback.jpeg",
                    "name": null,
                    "property": null,
                    "rel": "image_src",
                  },
                  "tag": "link",
                },
              ],
              "path": "/en/seo-test-all-filled",
              "teaserImage": null,
              "title": "SEO test - all filled in",
            },
            {
              "content": [
                {
                  "__typename": "BlockMarkup",
                },
              ],
              "hero": {
                "__typename": "Hero",
              },
              "locale": "de",
              "metaTags": [
                {
                  "attributes": {
                    "content": "Overwritten SEO title DE | Silverback Drupal Template",
                    "href": null,
                    "name": "title",
                    "property": null,
                    "rel": null,
                  },
                  "tag": "meta",
                },
                {
                  "attributes": {
                    "content": "SEO description DE",
                    "href": null,
                    "name": "description",
                    "property": null,
                    "rel": null,
                  },
                  "tag": "meta",
                },
                {
                  "attributes": {
                    "content": null,
                    "href": "http://127.0.0.1:8000/de/seo-test-all-filled-de",
                    "name": null,
                    "property": null,
                    "rel": "canonical",
                  },
                  "tag": "link",
                },
                {
                  "attributes": {
                    "content": null,
                    "href": "/sites/default/files/2024-04/the_silverback.jpeg",
                    "name": null,
                    "property": null,
                    "rel": "image_src",
                  },
                  "tag": "link",
                },
              ],
              "path": "/de/seo-test-all-filled-de",
              "teaserImage": null,
              "title": "SEO test - all filled in DE",
            },
          ],
        },
      },
    }
  `);
});

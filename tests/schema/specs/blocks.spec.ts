import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from '../lib.js';

test('Blocks', async () => {
  const result = await fetch(gql`
    fragment Blocks on Page {
      hero {
        __typename
        headline
        lead
        image {
          __typename
        }
        ctaText
        ctaUrl
        formUrl
      }
      content {
        __typename
        ... on BlockMarkup {
          markup
        }
        ... on BlockMedia {
          caption
          media {
            __typename
            ... on MediaImage {
              __typename
            }
            ... on MediaVideo {
              __typename
            }
          }
        }
        ... on BlockForm {
          url
        }
        ... on BlockImageTeasers {
          teasers {
            __typename
            image {
              __typename
            }
            title
            ctaText
            ctaUrl
          }
        }
        ... on BlockCta {
          url
          text
          openInNewTab
        }
        ... on BlockImageWithText {
          image {
            __typename
          }
          imagePosition
          textContent {
            __typename
            markup
          }
        }
      }
    }
    {
      complete: _loadDrupalPage(id: "a397ca48-8fad-411e-8901-0eba2feb989c") {
        ...Blocks
      }
      minimal: _loadDrupalPage(id: "ceb9b2a7-4c4c-4084-ada9-d5f6505d466b") {
        ...Blocks
      }
    }
  `);

  const firstParagraph = result.data.complete.content[0];
  firstParagraph.markup = firstParagraph.markup.replace(
    /data-id="\d+"/,
    'data-id="[numeric]"',
  );

  for (const block of result.data.complete.content) {
    if (block.__typename === 'BlockCta') {
      block.url = block.url.replace(/media\/\d+/, 'media/[numeric]');
    }
  }

  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "complete": {
          "content": [
            {
              "__typename": "BlockMarkup",
              "markup": "
    <p>A standalone paragraph with <strong><em>markup</em></strong> and <a href="/en/architecture" data-type="Content: Basic page" data-id="[numeric]" data-entity-type="node">link</a></p>
    ",
            },
            {
              "__typename": "BlockMedia",
              "caption": "Media image",
              "media": {
                "__typename": "MediaImage",
              },
            },
            {
              "__typename": "BlockMedia",
              "caption": "Media video",
              "media": {
                "__typename": "MediaVideo",
              },
            },
            {
              "__typename": "BlockForm",
              "url": "http://127.0.0.1:8000/en/form/contact",
            },
            {
              "__typename": "BlockImageWithText",
              "image": {
                "__typename": "MediaImage",
              },
              "imagePosition": "right",
              "textContent": {
                "__typename": "BlockMarkup",
                "markup": "
    <p>All kinds of allowed blocks</p>

    <ul><li>bla</li></ul>

    <h2 class="wp-block-custom-heading">Heading</h2>

    <figure class="wp-block-table"><table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><figcaption>Caption</figcaption></figure>

    <blockquote class="wp-block-quote"><p>Quote</p><cite>Citation</cite></blockquote>

    <p></p>
    ",
              },
            },
            {
              "__typename": "BlockMarkup",
              "markup": "
    <p>Starting from this paragraph, all the following blocks should be aggregated, as they are just HTML</p>

    <figure class="wp-block-table"><table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4 with <strong>markup</strong></td></tr></tbody></table><figcaption>Table caption</figcaption></figure>

    <ul><li>list 1</li><li>list 2<ol><li>list 2.2</li></ol></li></ul>

    <h3 class="wp-block-custom-heading">Heading 3</h3>

    <blockquote class="wp-block-quote"><p>Quote</p><cite>Citation</cite></blockquote>
    ",
            },
            {
              "__typename": "BlockImageTeasers",
              "teasers": [
                {
                  "__typename": "BlockImageTeaser",
                  "ctaText": "Foo",
                  "ctaUrl": "https://google.com",
                  "image": {
                    "__typename": "MediaImage",
                  },
                  "title": "Teaser 1",
                },
                {
                  "__typename": "BlockImageTeaser",
                  "ctaText": "Bar",
                  "ctaUrl": "https://google.com",
                  "image": {
                    "__typename": "MediaImage",
                  },
                  "title": "Teaser 2",
                },
              ],
            },
            {
              "__typename": "BlockCta",
              "openInNewTab": null,
              "text": "Internal CTA",
              "url": "/en/drupal",
            },
            {
              "__typename": "BlockCta",
              "openInNewTab": true,
              "text": "External CTA",
              "url": "https://www.google.com",
            },
            {
              "__typename": "BlockCta",
              "openInNewTab": null,
              "text": "CTA with link to media",
              "url": "/media/[numeric]",
            },
            {
              "__typename": "BlockMarkup",
              "markup": "
    <p></p>
    ",
            },
          ],
          "hero": {
            "__typename": "Hero",
            "ctaText": "CTA text",
            "ctaUrl": "https://example.com",
            "formUrl": "http://127.0.0.1:8000/en/form/contact",
            "headline": "All kinds of blocks with maximum data",
            "image": {
              "__typename": "MediaImage",
            },
            "lead": "Lead text",
          },
        },
        "minimal": {
          "content": [
            {
              "__typename": "BlockMedia",
              "caption": null,
              "media": null,
            },
            {
              "__typename": "BlockForm",
              "url": null,
            },
            {
              "__typename": "BlockMarkup",
              "markup": "
    <ul><li></li></ul>

    <figure class="wp-block-table"><table><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table></figure>

    <blockquote class="wp-block-quote"><p></p></blockquote>

    <h2 class="wp-block-custom-heading"></h2>
    ",
            },
            {
              "__typename": "BlockCta",
              "openInNewTab": null,
              "text": null,
              "url": null,
            },
            {
              "__typename": "BlockImageWithText",
              "image": null,
              "imagePosition": "left",
              "textContent": {
                "__typename": "BlockMarkup",
                "markup": "
    <p></p>
    ",
              },
            },
          ],
          "hero": {
            "__typename": "Hero",
            "ctaText": null,
            "ctaUrl": null,
            "formUrl": null,
            "headline": "All kinds of blocks with minimum data",
            "image": null,
            "lead": null,
          },
        },
      },
    }
  `);

  const german = await fetch(gql`
    {
      page: _loadDrupalPage(id: "a397ca48-8fad-411e-8901-0eba2feb989c:de") {
        content {
          __typename
          ... on BlockForm {
            url
          }
        }
      }
    }
  `);
  const germanForm = german.data.page.content.find(
    (it: any) => it.__typename === 'BlockForm',
  );
  expect(germanForm.url).toBe('http://127.0.0.1:8000/de/form/contact');
});

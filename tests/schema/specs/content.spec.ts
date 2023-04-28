import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from './lib';

test('Home page', async () => {
  const result = await fetch(gql`
    {
      loadPage(id: "0b45a665-286a-414e-a091-c13fa4e20eb2") {
        ...Page
      }
    }
    ${Page}
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadPage": {
          "content": [
            {
              "__typename": "BlockImage",
            },
          ],
          "hero": {
            "headline": "Architecture",
            "image": {
              "alt": "A beautiful landscape.",
              "source": "{\\"src\\":\\"http:\\\\/\\\\/127.0.0.1:8888\\\\/sites\\\\/default\\\\/files\\\\/2023-04\\\\/landscape.jpg\\",\\"width\\":2200,\\"height\\":1414}",
            },
            "lead": "Our decoupled website architecture.",
          },
          "locale": "en",
          "path": "/en/architecture",
          "title": "Architecture",
          "translations": [
            {
              "content": [
                {
                  "__typename": "BlockImage",
                },
              ],
              "locale": "en",
              "path": "/en/architecture",
              "title": "Architecture",
            },
            {
              "content": [
                {
                  "__typename": "BlockImage",
                },
              ],
              "locale": "de",
              "path": "/de/architektur",
              "title": "Architektur",
            },
          ],
        },
      },
    }
  `);
});

const Page = gql`
  fragment Page on Page {
    title
    path
    locale
    hero {
      headline
      lead
      image {
        source
        alt
      }
    }
    translations {
      title
      path
      locale
      content {
        __typename
      }
    }
    content {
      __typename
    }
  }
`;

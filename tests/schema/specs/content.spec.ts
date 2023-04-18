import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from './lib';

test('Page minimal', async () => {
  const result = await fetch(gql`
    {
      loadPage(id: "d5f4a2cc-68c2-4899-998d-cd37432f5070") {
        ...Page
      }
    }
    ${Page}
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadPage": {
          "content": [],
          "locale": "en",
          "path": "/en/page-minimal",
          "title": "Page minimal",
          "translations": [
            {
              "content": [],
              "locale": "en",
              "path": "/en/page-minimal",
              "title": "Page minimal",
            },
          ],
        },
      },
    }
  `);
});

test('Page translated', async () => {
  const result = await fetch(gql`
    {
      loadPage(id: "3f0ae3c2-6540-4190-921b-ee873a02f1cc") {
        ...Page
      }
    }
    ${Page}
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadPage": {
          "content": [],
          "locale": "en",
          "path": "/en/page-translations-en",
          "title": "Page with translations EN",
          "translations": [
            {
              "content": [],
              "locale": "en",
              "path": "/en/page-translations-en",
              "title": "Page with translations EN",
            },
            {
              "content": [],
              "locale": "de",
              "path": "/de/page-translations-de",
              "title": "Page with translations DE",
            },
          ],
        },
      },
    }
  `);
});

test('BlockText', async () => {
  const result = await fetch(gql`
    {
      loadPage(id: "a3534bc5-f576-40ce-bbee-7756a96a5435") {
        content {
          __typename
          ... on BlockText {
            markup
          }
        }
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadPage": {
          "content": [
            {
              "__typename": "BlockText",
              "markup": "
    <p>Some text goes <strong>here</strong>.</p>

    <p>And <em>there</em>.</p>
    ",
            },
          ],
        },
      },
    }
  `);
});

// TODO: Implement after images are integrated.
// test('BlockImage', async () => {
//   const result = await fetch(gql`
//     {
//       loadPage(id: "e741c3ba-9a69-49e7-a4db-f060841e2993") {
//         content {
//           __typename
//           ... on BlockImage {
//             source
//             alt
//             caption
//           }
//         }
//       }
//     }
//   `);
//   expect(result).toMatchInlineSnapshot(`
//     {
//       "data": {
//         "loadPage": {
//           "content": [
//             {
//               "__typename": "BlockImage",
//               "alt": "Kitten!",
//               "caption": "Caption with <strong><em>HTML</em></strong>!",
//               "source": {
//                 "src": "https://picsum.photos/200",
//               },
//             },
//             {
//               "__typename": "BlockImage",
//               "alt": "Kitten!",
//               "caption": null,
//               "source": {
//                 "src": "https://picsum.photos/200",
//               },
//             },
//           ],
//         },
//       },
//     }
//   `);
// });

const Page = gql`
  fragment Page on Page {
    title
    path
    locale
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

import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from '../lib.js';

test('Image', async () => {
  const result = await fetch(gql`
    {
      _loadMediaImage(id: "3a0fe860-a6d6-428a-9474-365bd57509aa") {
        source
        alt
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "_loadMediaImage": {
          "alt": "A beautiful landscape.",
          "source": "{"src":"http:\\/\\/127.0.0.1:8000\\/sites\\/default\\/files\\/2023-04\\/landscape.jpg","width":2200,"height":1414,"focalPoint":{"x":"1782","y":"1046"},"originalSrc":"http:\\/\\/127.0.0.1:8000\\/sites\\/default\\/files\\/2023-04\\/landscape.jpg"}",
        },
      },
    }
  `);
});

test('Video', async () => {
  const result = await fetch(gql`
    {
      _loadMediaVideo(id: "478c4289-961d-4ce8-85d6-578ae05f3019") {
        url
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "_loadMediaVideo": {
          "url": "http://127.0.0.1:8000/sites/default/files/2023-06/video_mp4_belt.mp4",
        },
      },
    }
  `);
});

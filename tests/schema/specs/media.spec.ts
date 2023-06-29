import gql from 'noop-tag';
import { expect, test } from 'vitest';

import { fetch } from '../lib.js';

test('Image', async () => {
  const result = await fetch(gql`
    {
      loadMediaImage(id: "3a0fe860-a6d6-428a-9474-365bd57509aa") {
        source
        alt
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadMediaImage": {
          "alt": "A beautiful landscape.",
          "source": "{\\"src\\":\\"http:\\\\/\\\\/127.0.0.1:8888\\\\/sites\\\\/default\\\\/files\\\\/2023-04\\\\/landscape.jpg\\",\\"width\\":2200,\\"height\\":1414}",
        },
      },
    }
  `);
});

test('Video', async () => {
  const result = await fetch(gql`
    {
      loadMediaVideo(id: "478c4289-961d-4ce8-85d6-578ae05f3019") {
        url
      }
    }
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "data": {
        "loadMediaVideo": {
          "url": "http://127.0.0.1:8888/sites/default/files/2023-06/video_mp4_belt.mp4",
        },
      },
    }
  `);
});

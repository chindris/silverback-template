import { expect, test } from '@playwright/test';
import gql from 'noop-tag';

test('example', async ({ request }) => {
  const result = await request.post('http://localhost:8888/graphql', {
    headers: {
      'api-key': 'cfdb0555111c0f8924cecab028b53474',
    },
    data: {
      query: gql`
        {
          loadPage(id: "f815e611-b92d-4ad7-878f-22d0dce1cec8") {
            title
          }
        }
      `,
    },
  });
  const body = (await result.body()).toString();
  expect(body).toMatchSnapshot();
});

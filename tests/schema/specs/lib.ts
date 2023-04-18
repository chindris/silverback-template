import got from 'got';

export const fetch = (query: string): Promise<any> =>
  got
    .post('http://127.0.0.1:8888/graphql', {
      headers: {
        'api-key': 'cfdb0555111c0f8924cecab028b53474',
      },
      body: JSON.stringify({
        query,
      }),
    })
    .json();

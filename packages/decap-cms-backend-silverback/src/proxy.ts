import type { Config, Context } from '@netlify/functions';

// TODO: Use a github app install token.
const githubToken = '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';

async function handleAPIForwarding(request: Request, context: Context) {
  const response = await fetch(
    'https://api.github.com/' + context.params['0'].substring(4),
    {
      method: request.method,
      body: request.body,
      // @ts-ignore: This is required, but not in fetch typing yet.
      duplex: 'half',
      headers: {
        ...request.headers,
        Authorization: `Bearer ${githubToken}`,
      },
    },
  );
  const header = new Headers(response.headers);
  header.delete('content-encoding');
  header.delete('content-length');
  const content = (await response.text()).replace(
    /https:\/\/api\.github\.com/g,
    'http://localhost:8000/_decap/api',
  );
  return new Response(content, {
    status: response.status,
    headers: header,
  });
}

export default async (request: Request, context: Context) => {
  if (context.params['0'].startsWith('api')) {
    return handleAPIForwarding(request, context);
  }

  return new Response('Not found', {
    status: 404,
  });
};

export const config: Config = {
  path: '/_github/*',
};

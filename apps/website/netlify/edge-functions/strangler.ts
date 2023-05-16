import { Config, Context } from 'https://edge.netlify.com';

type LegacyHost = {
  url: string;
  urlFilter?: (url: URL) => boolean;
  responseFilter?: (response: Response) => boolean;
};

const legacySystems: Array<LegacyHost> = [
  {
    // For Standard drupal redirects, we are interested in any
    // url (therefore no urlFilter) and only in redirects (301, 302).
    url: Deno.env.get('DRUPAL_EXTERNAL_URL') || 'http://localhost:8888',
    responseFilter: (response) => [301, 302].includes(response.status),
  },
];

export default async function strangler(
  originalRequest: Request,
  context: Context,
) {
  // Test if netlify can handle the request.
  // Clone the request, or the invocation of next() will consume the body.
  const netlifyResult = await context.next(originalRequest.clone(), {
    sendConditionalRequest: false,
  });

  if (netlifyResult.status !== 404) {
    return netlifyResult;
  }

  // Otherwise, pass the request to the legacy applications.
  for (const legacyUrl of legacySystems) {
    const request = originalRequest.clone();
    const targetUrl = new URL(legacyUrl.url);
    // Check if we even want to proxy this request.
    // Skip if the urlFilter exists and returns false.
    if (legacyUrl.urlFilter && !legacyUrl.urlFilter(targetUrl)) {
      console.log('Skipping', legacyUrl.url);
      continue;
    }
    const url = new URL(request.url);
    const reqHeaders = new Headers(request.headers);
    // Add the silverback proxy header to the request.
    reqHeaders.set(
      'SLB-Forwarded-Proto',
      targetUrl.protocol.substring(0, url.protocol.length - 1),
    );
    reqHeaders.set('SLB-Forwarded-Host', url.host);
    reqHeaders.set('SLB-Forwarded-Port', url.port);

    url.protocol = targetUrl.protocol;
    url.host = targetUrl.host;
    const result = await fetch(url, {
      redirect: 'manual',
      headers: reqHeaders,
      method: request.method,
      body: request.body || undefined,
    });
    console.log(legacyUrl.url, result.status);

    // Check if we want to return this response.
    // Either if there is no response filter, or it returns true.
    // Otherwise continue with the next legacy system.
    if (!legacyUrl.responseFilter || legacyUrl.responseFilter(result)) {
      return result;
    }
  }

  // If none of the legacy systems returned a response, return the inital 404
  // response by netlify.
  return netlifyResult;
}

export const config = {
  path: '/*',
  excludedPath: [
    '/__preview/*',
    '/_gatsby/*',
    '/page-data/*',
    '/static/*',
    '/*.js',
    // TODO: add more paths that we know are served statically for sure or are not legacy.
  ],
} satisfies Config;

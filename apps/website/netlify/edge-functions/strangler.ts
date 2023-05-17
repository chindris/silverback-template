import { Config, Context } from 'https://edge.netlify.com';

type LegacyHost = {
  /**
   * The base url of the legacy system. The request will be forwarded to the
   * base url if Netlify does not have a page for the requested path.
   */
  url: string;
  /**
   * Check if a given URL applies to this legacy system. If not defined, the
   * legacy system will be used for all requests.
   */
  applies?: (url: URL) => boolean;
  /**
   * Alter the legacy system response. If this function returns undefined, the
   * response will be ignored. If the function is not defined, the response will
   * always be returned as is.
   */
  process?: (response: Response) => Response | Promise<Response> | undefined;
};

console.log('[strangler]: starting', Deno.env.get('DRUPAL_EXTERNAL_URL'));

/**
 * List of legacy system that should be proxied.
 *
 * For each URL, systems are checked in order. The first system that returns a valid
 * result will be used. Otherwise the 404 page response will be returned.
 */
const legacySystems: Array<LegacyHost> = [
  {
    // For Standard drupal redirects, we are interested in any
    // url (therefore no urlFilter) and only in redirects (301, 302).
    url: Deno.env.get('DRUPAL_EXTERNAL_URL') || 'http://localhost:8888',
    process: (response) =>
      [301, 302].includes(response.status) ? response : undefined,
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

  console.log('[strangler]: handling', originalRequest.url);

  // Otherwise, pass the request to the legacy applications.
  for (const legacySystem of legacySystems) {
    const request = originalRequest.clone();
    const targetUrl = new URL(legacySystem.url);
    // Check if we even want to proxy this request.
    // Skip if the urlFilter exists and returns false.
    if (legacySystem.applies && !legacySystem.applies(targetUrl)) {
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

    console.log('[strangler]: responding', url.toString(), result.status);

    // Process the response if the legacy system wants to, otherwise return
    // it as is.
    return legacySystem.process ? legacySystem.process(result) : result;
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
    '/sites/default/files/*',
    // TODO: add more paths that we know are served statically for sure or are not legacy.
  ],
} satisfies Config;

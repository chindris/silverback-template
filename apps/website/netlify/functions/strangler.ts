import { createStrangler } from '@amazeelabs/strangler-netlify';
import fs from 'fs';

export const handler = createStrangler(
  [
    {
      // For Standard drupal redirects, we are interested in any
      // url (therefore no urlFilter) and only in redirects (301, 302).
      url:
        process.env.DRUPAL_INTERNAL_URL ||
        process.env.DRUPAL_EXTERNAL_URL ||
        'http://127.0.0.1:8888',
      process: (response) =>
        [301, 302].includes(response.status) ? response : undefined,
    },
  ],
  // On Local environments, the public folder sits inside a dist folder, so we
  // need to check both cases.
  fs.existsSync('public/404.html')
    ? fs.readFileSync('public/404.html').toString()
    : fs.readFileSync('dist/public/404.html').toString(),
);

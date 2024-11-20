import { githubProxy } from '@amazeelabs/decap-cms-backend-token-auth/proxy';
import type { Context } from '@netlify/functions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (request: Request, context: Context) {
  if (!process.env.DECAP_GITHUB_TOKEN) {
    throw new Error('Missing environment variable DECAP_GITHUB_TOKEN.');
  }
  return githubProxy(
    request,
    process.env.DECAP_GITHUB_TOKEN,
    '/.netlify/functions/github-proxy',
  );
}

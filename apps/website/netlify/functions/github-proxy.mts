import type { Context, Config } from '@netlify/functions';
import { githubProxy } from '@amazeelabs/decap-cms-backend-silverback/proxy';

export const config: Config = {
  path: '/admin/_github/*',
};

export default function (request: Request, context: Context) {
  if (!process.env.DECAP_GITHUB_TOKEN) {
    throw new Error('No Github token configured');
  }
  return githubProxy(request, process.env.DECAP_GITHUB_TOKEN, '/admin/_github');
}

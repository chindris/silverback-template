import {
  EmailBackend,
  JwtEncoder,
  TokenAuthHandler,
} from '@amazeelabs/token-auth-middleware';
import type { Context } from '@netlify/edge-functions';

// Store the current login link so tests can fetch it via /___link.
let loginLink: string | null = null;

class TestEmailBackend extends EmailBackend {
  async deliver(payload: { email: string }, link: string) {
    const info = await this.getInfo(payload);
    if (!info) {
      console.error(`Failed to get info for ${payload.email}`);
      return;
    }
    loginLink = link;
    console.log(`Login link for ${info.name} (${info.email}): ${link}`);
  }
}

const encoder = new JwtEncoder('shhhh');
const backend = new TestEmailBackend({
  '*@amazeelabs.com': '*',
});

const handler = new TokenAuthHandler(encoder, backend, {
  tokenLifetime: 300,
  loginUrl: '/login.html',
});

export default async (request: Request, context: Context) => {
  // For integration tests to retrieve the login link.
  if (request.url.endsWith('/___link')) {
    let response: Response;
    if (loginLink) {
      response = new Response(loginLink, { status: 200 });
    } else {
      response = new Response('No link generated yet', { status: 404 });
      loginLink = null;
    }
    return response;
  }
  return handler.handle(request, context.next);
};

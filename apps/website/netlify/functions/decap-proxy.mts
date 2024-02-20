import type { Context, Config } from '@netlify/functions';
import { createHash } from 'crypto';

// TODO: Use a github app install token.
const githubToken = `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`;
// TODO: inject hash salt as environment variable
const hashSalt = 'banana';
// TODO: configurable email whitelist
const acceptedEmails = ['philipp.melab@amazeelabs.com'];
// TODO: configurable lifetimes as environment variable
const tokenLifetime = 60 * 5;
const sessionLifetime = 0;

export default async (request: Request, context: Context) => {
  if (request.method === 'OPTIONS') {
    return new Response(undefined, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.params['0'].startsWith('api/')) {
    if (!validateSession(request)) {
      return new Response('', {
        status: 401,
      });
    }
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

  if (request.method === 'POST') {
    if (context.params['0'].startsWith('login')) {
      const email = await request.text();
      if (acceptedEmails.includes(email)) {
        // TODO: Send token via email
        context.log(`Login link for ${email}: ${context.site.url}/admin/?token=${createToken(email, tokenLifetime)}`);
      }
      else {
        console.log(`Invalid login attempt: ${email}`);
      }

      return new Response('', {
        status: 200,
      });

    }
    if (context.params['0'].startsWith('auth')) {
      const token = await request.text();
      if (validateToken(token)) {
        const { email } = getTokenInfo(token);
        if (!acceptedEmails.includes(email)) {
          return new Response('', {
            status: 403,
          });
        }
        const sessionToken = createToken(email, sessionLifetime);
        return new Response('', {
          status: 200,
          headers: {
            'Set-Cookie': `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Path=/_decap/`,
          },
        });
      } else {
        return new Response('', {
          status: 401,
        });
      }
    }

    if (context.params['0'].startsWith('logout')) {
      return new Response('', {
        status: 200,
        headers: {
          'Set-Cookie': `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0;  Path=/_decap/`,
        },
      });
    }
  }

  if (request.method === 'GET') {
    if (context.params['0'].startsWith('status')) {
      const session = validateSession(request);
      if (session) {
        return new Response(session, {
          status: 200,
        });
      }
      return new Response('', {
        status: 401,
      });
    }
  }

  return new Response('Not found', {
    status: 404,
  });
};

function validateSession(request: Request) {
  const cookies = request.headers.get('Cookie');
  if (cookies) {
    const session = cookies.split(';').find((c) => c.trim().startsWith('session='));
    if (session) {
      const token = session.split('=')[1];
      if (validateToken(token)) {
        const { email } = getTokenInfo(token);
        if (acceptedEmails.includes(email)) {
          return email;
        }
      }
    }
  }
  return false;

}

/**
 * Generate a token.
 *
 * @param email
 * @param lifetime
 */
function createToken(email: string, lifetime: number) {
  const validUntil = new Date().getTime() + lifetime * 1000;
  return `${email}:${validUntil}:${hashToken(email, validUntil)}`;
}

function hashToken(email: string, validUntil: number) {
  return createHash('sha256')
    .update(email + hashSalt + validUntil)
    .digest('hex');
}

function validateToken(token: string) {
  const email = token.split(':')[0];
  const validUntil = parseInt(token.split(':')[1], 10);
  const hash = token.split(':')[2];

  if (validUntil !== 0 && validUntil < new Date().getTime()) {
    return false;
  }

  const valid = hashToken(email, validUntil);
  return hash === valid;
}

function getTokenInfo(token: string) {
  const email = token.split(':')[0];
  const validUntil = parseInt(token.split(':')[1], 10);
  return {
    email,
    validUntil,
  };
}

export const config: Config = {
  path: '/_decap/*',
};

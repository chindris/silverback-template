import type { Context, Config } from '@netlify/functions';
import { createHash } from 'crypto';


// TODO: Use a github app install token.
const githubToken = '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';
// TODO: inject hash salt as environment variable
const hashSalt = 'banana';
// TODO: configurable email whitelist
const acceptedEmails = { 'philipp.melab@amazeelabs.com': 'Philipp Melab' };
// TODO: configurable lifetimes as environment variable
const tokenLifetime = 60 * 5;
const sessionLifetime = 0;
const postmarkToken = 'abc';

async function sendLoginLink(email: string, name, link) {
  const result = await fetch('https://api.postmarkapp.com/email/withTemplate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': postmarkToken,
    },
    body: JSON.stringify({
      // TODO: Make all this data configurable.
      TemplateAlias: 'decap-login',
      From: 'philipp.melab@amazeelabs.com',
      To: email,
      TemplateModel: {
        product_url: 'https://example.amazeelabs.dev/admin/',
        product_name: 'Silverback Starter Decap',
        name: name,
        action_url: link,
        company_name: 'Amazee Labs AG',
        company_address: 'Förrlibuckstrasse 190\nCH-8005 Zurich',
      },
    })
  });
  if (result.status !== 200) {
    throw new Error(await result.text());
  }
}


export default async (request: Request, context: Context) => {
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
      if (acceptedEmails.hasOwnProperty(email)) {
        const link = `${
          context.site.url
        }/admin/?token=${createToken(email, tokenLifetime)}`;

        context.log(
          `Login link for ${email}: ${link}`,
        );
        try {
          await sendLoginLink(email, acceptedEmails[email], link);
        }
        catch (e) {
          if (e instanceof Error) {
            context.log(`[ERROR] Failed to send email: ${e.message}`);
          }
          return new Response(`Failed to send email: ${e.message}`, {
            status: 500,
          });
        }
      } else {
        console.log(`Invalid login attempt: ${email}`);
      }

      return new Response('', {
        status: 200,
      });
    }
    if (context.params['0'].startsWith('auth')) {
      const token = await request.text();
      if (validateToken(token)) {
        const info = getTokenInfo(token);
        if (!acceptedEmails.hasOwnProperty(info.email)) {
          return new Response('', {
            status: 403,
          });
        }
        const sessionToken = createToken(info.email, sessionLifetime);
        return new Response(JSON.stringify(info), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
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
        return new Response(JSON.stringify(session), {
          headers: {
            'Content-Type': 'application/json',
          },
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
    const session = cookies
      .split(';')
      .find((c) => c.trim().startsWith('session='));
    if (session) {
      const token = session.split('=')[1];
      if (validateToken(token)) {
        const info = getTokenInfo(token);
        if (acceptedEmails.hasOwnProperty(info.email)) {
          return info;
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
  const validUntil =
    lifetime === 0 ? 0 : new Date().getTime() + lifetime * 1000;
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
    name: acceptedEmails[email] || 'Unknown',
  };
}

export const config: Config = {
  path: '/_decap/*',
};

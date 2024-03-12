import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailBackend } from './email-backend.js';
import { cookieHeader, metaRedirect, TokenAuthHandler } from './handler.js';
import { JwtEncoder } from './jwt-encoder.js';

beforeEach(() => {
  vi.resetAllMocks();
});

const delivery = vi.fn();

class MockedEmailBackend extends EmailBackend {
  async deliver(payload: { email: string }, link: string): Promise<void> {
    const info = await this.getInfo(payload);
    delivery(info?.email, info?.name, link);
  }
}

describe('Token Auth Handler', () => {
  const encoder = new JwtEncoder<{
    email: string;
  }>('shhh');

  const backend = new MockedEmailBackend({
    'bob@amazeelabs.dev': 'Bob',
  });

  describe('arbitrary requests', () => {
    it('blocks non-html requests without authentication', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource'),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(401);
    });

    it('blocks html requests if there is no login url', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource', {
          headers: {
            Accept: 'text/html',
          },
        }),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(401);
    });

    it('redirects html requests to the login url', async () => {
      const handler = new TokenAuthHandler(encoder, backend, {
        loginUrl: 'test:/login',
      });
      const response = await handler.handle(
        new Request('test:/resource?a=b', {
          headers: {
            Accept: 'text/html',
          },
        }),
        async () => new Response(''),
      );
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'test:/login?destination=test%3A%2Fresource%3Fa%3Db',
      );
    });

    it('returns the proxied response if the session is valid', async () => {
      const sessionToken = await encoder.create({
        email: 'bob@amazeelabs.dev',
      });
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource', {
          headers: {
            Cookie: `session=${sessionToken}`,
          },
        }),
        async () => new Response('restricted resource'),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(200);
      expect(await response.text()).toBe('restricted resource');
    });
  });

  describe('login requests', () => {
    it('responds with 405 if the login request is not a POST', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request(
          'test:/resource/___login?destination=test%3A%2Fresource%3Fa%3Db',
          {
            method: 'GET',
            headers: {
              Accept: 'text/html',
            },
          },
        ),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('public');
      expect(response.status).toBe(405);
    });

    it('shows a default notification', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const formData = new URLSearchParams();
      formData.append('email', 'idont@exist.com');
      const response = await handler.handle(
        new Request(
          'test:/resource/___login?destination=test%3A%2Fresource%3Fa%3Db',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData,
          },
        ),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(
        'A login-link has been sent to the provided e-mail address.',
      );
    });

    it('redirects to a notification page', async () => {
      const handler = new TokenAuthHandler(encoder, backend, {
        notificationUrl: 'test:/notification',
      });
      const formData = new URLSearchParams();
      formData.append('email', 'idont@exist.com');
      const response = await handler.handle(
        new Request('test:/resource/___login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Referer: 'test:/login.html?destination=test%3A%2Fresource%3Fa%3Db',
          },
          body: formData,
        }),
        async () => new Response(''),
      );
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('test:/notification');
    });

    it('sends a login link', async () => {
      vi.setSystemTime(new Date('2024-01-01 00:00:00'));
      const handler = new TokenAuthHandler(encoder, backend, {
        tokenLifetime: 10,
      });
      const token = await encoder.create({ email: 'bob@amazeelabs.dev' }, 10);
      const formData = new URLSearchParams();
      formData.append('email', 'bob@amazeelabs.dev');
      await handler.handle(
        new Request('test:/resource/___login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formData,
        }),
        async () => new Response(''),
      );
      expect(delivery).toHaveBeenCalledWith(
        'bob@amazeelabs.dev',
        'Bob',
        `test:/resource/___auth?token=${token}`,
      );
    });

    it('sends a login link, retaining a destination parameter', async () => {
      vi.setSystemTime(new Date('2024-01-01 00:00:00'));
      const handler = new TokenAuthHandler(encoder, backend, {
        tokenLifetime: 10,
      });
      const token = await encoder.create({ email: 'bob@amazeelabs.dev' }, 10);
      const formData = new URLSearchParams();
      formData.append('email', 'bob@amazeelabs.dev');
      await handler.handle(
        new Request(
          'test:/resource/___login?destination=' +
            encodeURIComponent('test:/resource?a=b'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData,
          },
        ),
        async () => new Response(''),
      );
      expect(delivery).toHaveBeenCalledWith(
        'bob@amazeelabs.dev',
        'Bob',
        `test:/resource/___auth?destination=test%3A%2Fresource%3Fa%3Db&token=${token}`,
      );
    });

    it('sends a login link with the referrer as destination', async () => {
      vi.setSystemTime(new Date('2024-01-01 00:00:00'));
      const handler = new TokenAuthHandler(encoder, backend, {
        tokenLifetime: 10,
      });
      const token = await encoder.create({ email: 'bob@amazeelabs.dev' }, 10);
      const formData = new URLSearchParams();
      formData.append('email', 'bob@amazeelabs.dev');
      await handler.handle(
        new Request('test:/resource/___login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Referer: 'test:/login.html?destination=test%3A%2Fresource%3Fa%3Db',
          },
          body: formData,
        }),
        async () => new Response(''),
      );
      expect(delivery).toHaveBeenCalledWith(
        'bob@amazeelabs.dev',
        'Bob',
        `test:/resource/___auth?destination=test%3A%2Fresource%3Fa%3Db&token=${token}`,
      );
    });
  });

  describe('authentication requests', () => {
    it('returns 401 if the token is invalid', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource/___auth?token=invalid'),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(401);
    });

    it('writes a cookie on successful authentication and redirects to the destination', async () => {
      vi.setSystemTime(new Date('2024-01-01 00:00:00'));
      const token = await encoder.create({ email: 'bob@amazeelabs.dev' }, 60);
      const sessionToken = await encoder.create({
        email: 'bob@amazeelabs.dev',
      });
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request(
          `test:/resource/___auth?destination=test%3A%2Fresource%3Fa%3Db&token=${token}`,
        ),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(200);
      expect(await response.text()).toContain(
        metaRedirect('Login successful', 'test:/resource?a=b'),
      );
      expect(response.headers.get('Set-Cookie')).toEqual(
        cookieHeader(sessionToken, '/resource/'),
      );
    });
  });

  describe('status requests', () => {
    it('returns 401 if the session is invalid', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource/___status'),
        async () => new Response(''),
      );
      expect(response.status).toBe(401);
    });

    it('returns the user information if the session is valid', async () => {
      const sessionToken = await encoder.create({
        email: 'bob@amazeelabs.dev',
      });
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource/___status', {
          headers: {
            Cookie: cookieHeader(sessionToken, '/resource/'),
          },
        }),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(await response.json()).toEqual({
        token: sessionToken,
        email: 'bob@amazeelabs.dev',
        name: 'Bob',
      });
    });
  });

  describe('logout requests', () => {
    it('returns 405 if the request is not a POST', async () => {
      const handler = new TokenAuthHandler(encoder, backend);
      const response = await handler.handle(
        new Request('test:/resource/___logout', {
          headers: {
            Referer: 'test:/resource/',
          },
        }),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('public');
      expect(response.status).toBe(405);
    });

    it('clears the session cookie and reloads the same page', async () => {
      const handler = new TokenAuthHandler(encoder, backend, {
        loginUrl: 'test:/login',
      });
      const response = await handler.handle(
        new Request('test:/resource/___logout', {
          method: 'POST',
          headers: {
            Referer: 'test:/resource/',
          },
        }),
        async () => new Response(''),
      );
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(response.status).toBe(200);
      expect(await response.text()).toEqual(
        metaRedirect('Logged out', 'test:/resource/'),
      );
      expect(response.headers.get('Set-Cookie')).toEqual(
        cookieHeader('', '/resource/'),
      );
    });
  });
});

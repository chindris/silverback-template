export type TokenAuthHandlerOptions = {
  /**
   * URL to redirect to when the user is not authenticated.
   */
  loginUrl?: string;

  /**
   * URL to redirect to when the login link has been sent.
   */
  notificationUrl?: string;

  /**
   * Lifetime of the login token in seconds.
   * Defaults to one minute.
   */
  tokenLifetime?: number;

  /**
   * Lifetime of the session in seconds.
   * Defaults to no expiration.
   */
  sessionLifetime?: number;
};

export class TokenExpiredError extends Error {
  constructor() {
    super('Token expired');
  }
}

export class TokenInvalidError extends Error {
  constructor() {
    super('Token invalid');
  }
}

export type Payload = Record<string, string>;
export type Info = Record<string, any>;

export interface TokenEncoderInterface<TPayload extends Payload> {
  create(payload: TPayload, lifetime?: number): Promise<string>;

  /**
   * @throws TokenExpiredError
   * @throws TokenInvalidError
   * @param token
   */
  validate(token: string): Promise<TPayload | null>;
}

export interface AuthenticationBackendInterface<
  TPayload extends Payload,
  TInfo extends Info,
> {
  getInfo(payload: Partial<TPayload>): Promise<TInfo | undefined>;
  deliver(payload: TPayload, link: string): Promise<void>;
}

export function metaRedirect(message: string, destination: string) {
  return `<html lang="en"><head><title>${message}</title><meta http-equiv="refresh" content="0;url=${destination}" /></head></html>`;
}

export function cookieHeader(token: string, path: string) {
  return `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=${path}`;
}

export class TokenAuthHandler<TPayload extends Payload> {
  protected options: TokenAuthHandlerOptions;
  constructor(
    protected encoder: TokenEncoderInterface<TPayload>,
    protected backend: AuthenticationBackendInterface<TPayload, any>,
    options: TokenAuthHandlerOptions = {},
  ) {
    this.options = {
      tokenLifetime: 60,
      sessionLifetime: 0,
      ...options,
    };
  }

  async handle(req: Request, next: () => Promise<Response>) {
    const path = new URL(req.url).pathname;

    if (path.endsWith('___login')) {
      if (req.method !== 'POST') {
        return new Response('Has to be a POST request', {
          status: 405,
          headers: {
            'Cache-Control': 'public',
          },
        });
      }
      if (
        req.headers
          .get('Content-Type')
          ?.includes('application/x-www-form-urlencoded')
      ) {
        const payload = Object.fromEntries(
          new URLSearchParams(await req.text()),
        ) as TPayload;
        const info = await this.backend.getInfo(payload);
        if (info) {
          const url = new URL(req.url);
          const referrer = req.headers.get('Referer');
          const destination = referrer
            ? new URL(referrer).searchParams.get('destination')
            : null;
          if (destination) {
            url.searchParams.append('destination', destination);
          }
          const token = await this.encoder.create(
            payload,
            this.options.tokenLifetime,
          );
          url.searchParams.append('token', token);
          url.pathname = url.pathname.replace('___login', '___auth');
          const link = url.toString();
          await this.backend.deliver(payload, link);
        }
        // We don't want anybody to try email addresses, so we show the
        // notification every time, regardless of the result.
        if (this.options.notificationUrl) {
          return Response.redirect(this.options.notificationUrl, 302);
        } else {
          return new Response(
            'A login-link has been sent to the provided e-mail address.',
            {
              status: 200,
              headers: {
                'Cache-Control': 'no-store',
              },
            },
          );
        }
      }
    }

    if (path.endsWith('___auth')) {
      const token = new URL(req.url).searchParams.get('token');
      if (token) {
        try {
          const payload = await this.encoder.validate(token);
          if (payload) {
            const info = await this.backend.getInfo(payload);
            if (info) {
              const url = new URL(req.url);
              const destination = url.searchParams.get('destination') || '/';
              const cookiePath = url.pathname.replace('___auth', '');
              const sessionToken = await this.encoder.create(
                payload,
                this.options.sessionLifetime,
              );
              return new Response(
                metaRedirect('Login successful', destination),
                {
                  status: 200,
                  headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-store',
                    'Set-Cookie': cookieHeader(sessionToken, cookiePath),
                  },
                },
              );
            }
          }
        } catch (e) {
          return new Response('', {
            status: 401,
            headers: {
              'Cache-Control': 'no-store',
            },
          });
        }
      }
      return new Response('', {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    if (path.endsWith('___logout')) {
      if (req.method !== 'POST') {
        return new Response('Has to be a POST request.', {
          status: 405,
          headers: {
            'Cache-Control': 'public',
          },
        });
      }
      const url = new URL(req.url);
      const cookiePath = url.pathname.replace('___logout', '');

      const destination = req.headers.get('Referer');

      return new Response(
        metaRedirect('Logged out', destination || cookiePath),
        {
          status: 200,
          headers: {
            'Set-Cookie': cookieHeader('', cookiePath),
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const sessionToken = parseCookies(req);
    if (sessionToken) {
      try {
        const payload = await this.encoder.validate(sessionToken);
        if (payload) {
          const info = await this.backend.getInfo(payload);
          if (info) {
            if (path.endsWith('___status')) {
              return new Response(JSON.stringify(info), {
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-store',
                },
                status: 200,
              });
            }

            const response = await next();
            response.headers.set('Cache-Control', 'no-store');
            return response;
          }
        }
      } catch (e) {
        // Do nothing, just treat it as if there was no cookie.
      }
    }

    if (
      req.headers.get('Accept')?.includes('text/html') &&
      this.options.loginUrl
    ) {
      return Response.redirect(
        `${this.options.loginUrl}?destination=${encodeURIComponent(req.url)}`,
        302,
      );
    }

    return new Response('Not authenticated', {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}

function parseCookies(request: Request) {
  const cookies = request.headers.get('Cookie');
  if (cookies) {
    const session = cookies
      .split(';')
      .find((c) => c.trim().startsWith('session='));
    if (session) {
      return session.split('=')[1];
    }
  }
  return false;
}

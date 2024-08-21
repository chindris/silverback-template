import { NextFunction, Request, RequestHandler, Response } from 'express';
import basicAuth from 'express-basic-auth';

import { getConfig } from './config.js';
import { oAuth2AuthCodeMiddleware } from './oAuth2.js';

/**
 * Returns the Express authentication middleware based on the configuration.
 *
 * Favours OAuth2, then Basic Auth, then falling back to no auth
 * if not configured (= grant access).
 */
export const getAuthenticationMiddleware = (): RequestHandler =>
  ((): RequestHandler => {
    const config = getConfig();
    switch (config.authenticationType) {
      case 'oauth2':
        if (config.oAuth2) {
          return oAuth2AuthCodeMiddleware;
        } else {
          console.error('Missing OAuth2 configuration.');
        }
        break;
      case 'basic':
        if (config.basicAuth) {
          return basicAuth({
            users: { [config.basicAuth.username]: config.basicAuth.password },
            challenge: true,
          });
        } else {
          console.error('Missing basic auth configuration.');
        }
        break;
      case 'noauth':
        break;
      default:
        console.error('Unknown authentication type.');
        break;
    }

    return (req: Request, res: Response, next: NextFunction): void => next();
  })();

/**
 * Checks if a session is required based on the configuration.
 */
export const isSessionRequired = (): boolean => {
  let result = false;
  if (getConfig().oAuth2) {
    const oAuth2Config = getConfig().oAuth2;
    if (!oAuth2Config) {
      throw new Error('Missing OAuth2 configuration.');
    }
    result = true;
  }
  return result;
};

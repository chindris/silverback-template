import { OAuth2GrantTypes } from './oAuth2GrantTypes';

export type PreviewConfig = {
  /**
   * Enables basic auth.
   */
  basicAuth?: {
    username: string;
    password: string;
  };
  /**
   * Enables OAuth2.
   */
  oAuth2?: {
    clientId: string;
    clientSecret: string;
    scope: string;
    tokenHost: string;
    tokenPath: string;
    grantType: OAuth2GrantTypes;
    // Use for Authorization Code grant type only.
    authorizePath?: string;
    sessionSecret?: string;
    environmentType?: string; // 'development' | 'production';
  };
};

export const getConfig = (): PreviewConfig => {
  return {
    basicAuth: {
      username: 'test',
      password: 'test',
    },
    // When several authentication methods are configured,
    // oAuth2 takes precedence.
    // oAuth2: {
    //   clientId: process.env.OAUTH2_CLIENT_ID || 'preview',
    //   clientSecret: process.env.OAUTH2_CLIENT_ID || 'preview',
    //   // Applies for ResourceOwnerPassword only.
    //   scope: process.env.OAUTH2_SCOPE || 'preview',
    //   tokenHost: process.env.OAUTH2_TOKEN_HOST || 'http://127.0.0.1:8888',
    //   tokenPath: process.env.OAUTH2_TOKEN_PATH || '/oauth/token',
    //   authorizePath:
    //     process.env.OAUTH2_AUTHORIZE_PATH ||
    //     '/oauth/authorize?response_type=code',
    //   sessionSecret: process.env.OAUTH2_SESSION_SECRET || 'banana',
    //   environmentType: process.env.OAUTH2_ENVIRONMENT_TYPE || 'development',
    //   grantType: 0, // AuthorizationCode
    // },
  };
};

// let _config: PreviewConfig | null = null;

// export const getConfig = (): PreviewConfig => {
//   if (!_config) {
//     throw new Error('Config is not set');
//   }
//   return _config;
// };
//
// export const setConfig = (config: PreviewConfig): void => {
//   _config = config;
// };
//
// export const clearConfig = (): void => {
//   _config = null;
// };

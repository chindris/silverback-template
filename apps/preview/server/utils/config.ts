export type PreviewConfig = {
  authenticationType: string; // 'oauth2' | 'basic' | 'noauth';
  drupalHost: string;
  /**
   * Basic auth.
   */
  basicAuth?: {
    username: string;
    password: string;
  };
  /**
   * OAuth2.
   */
  oAuth2?: {
    clientId: string;
    clientSecret: string;
    scope: string;
    tokenHost: string;
    tokenPath: string;
    authorizePath: string;
    sessionSecret: string;
    environmentType?: string; // 'development' | 'production';
  };
};

export const getConfig = (): PreviewConfig => {
  return {
    authenticationType: process.env.AUTHENTICATION_TYPE || 'noauth',
    drupalHost: process.env.DRUPAL_URL || 'http://127.0.0.1:8888',
    basicAuth: {
      username: process.env.BASIC_AUTH_USER || 'test',
      password: process.env.BASIC_AUTH_PASSWORD || 'test',
    },
    oAuth2: {
      clientId: process.env.OAUTH2_CLIENT_ID || 'preview',
      clientSecret: process.env.OAUTH2_CLIENT_SECRET || 'preview',
      scope: process.env.OAUTH2_SCOPE || 'preview',
      tokenHost: process.env.DRUPAL_URL || 'http://127.0.0.1:8888',
      tokenPath: process.env.OAUTH2_TOKEN_PATH || '/oauth/token',
      authorizePath:
        process.env.OAUTH2_AUTHORIZE_PATH ||
        '/oauth/authorize?response_type=code',
      sessionSecret: process.env.OAUTH2_SESSION_SECRET || 'banana',
      environmentType: process.env.OAUTH2_ENVIRONMENT_TYPE || 'development',
    },
  };
};

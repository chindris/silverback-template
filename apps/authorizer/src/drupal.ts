import {
  Oauth2Adapter,
  Oauth2WrappedConfig,
} from '@openauthjs/openauth/adapter/oauth2';

export interface DrupalConfig extends Oauth2WrappedConfig {
  domain: string;
  clientID: string;
  clientSecret: string;
  scopes: string[];
}

export function DrupalAdapter(config: DrupalConfig) {
  const domain = config.domain || 'http://127.0.0.1:8888';
  return Oauth2Adapter({
    type: 'drupal',
    ...config,
    endpoint: {
      // @todo remove language, testing without redirects first.
      authorization: `${domain}/en/oauth/authorize`,
      token: `${domain}/en/oauth/token`,
    },
  });
}

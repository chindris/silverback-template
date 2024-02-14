import CredentialsProvider from 'next-auth/providers/credentials';

export const AUTH_DRUPAL_URL =
  process.env.AUTH_DRUPAL_URL || 'http://127.0.0.1:8888';

/** @type {import("next-auth").NextAuthOptions} */
export const authConfig = {
  providers: [
    // Dummy provider for local development
    // without the need to set up e.g. OAuth.
    CredentialsProvider({
      credentials: {
        Password: { placeholder: `type "password"`, type: 'password' },
      },
      // @ts-ignore
      authorize(credentials) {
        // @ts-ignore
        if (credentials.Password === 'password') {
          return {
            name: 'Amazee Labs',
            email: 'hello@amazeelabs.com',
            image: 'https://www.amazeelabs.com/images/icon.png',
          };
        }
      },
    }),
    {
      // Client ID and secret are set in the Drupal Consumer.
      clientId: process.env.AUTH_DRUPAL_ID || 'gatsby',
      clientSecret: process.env.AUTH_DRUPAL_SECRET || 'gatsby',
      id: 'drupal',
      name: 'Drupal',
      type: 'oauth',
      // Language prefix is added to prevent 301
      // that will not be handled by NextAuth.
      authorization: {
        url: `${AUTH_DRUPAL_URL}/en/oauth/authorize`,
        params: {
          // @todo refine scope, editor (role) is used for now.
          scope: 'editor',
        },
      },
      idToken: false,
      token: `${AUTH_DRUPAL_URL}/en/oauth/token`,
      userinfo: `${AUTH_DRUPAL_URL}/en/oauth/userinfo`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  theme: {
    logo: 'https://www.amazeelabs.com/images/icon.png',
    colorScheme: 'light',
    brandColor: '#951B81',
  },
};

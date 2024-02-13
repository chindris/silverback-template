/** @type {import("next-auth").NextAuthOptions} */
export const authConfig = {
  // @todo set hardcoded configuration from env vars.
  providers: [
    {
      // Client ID and secret are set in the Drupal Consumer.
      clientId: 'gatsby_editor',
      clientSecret: 'gatsby_editor',
      id: 'drupal',
      name: 'DrupalProvider',
      type: 'oauth',
      // Language prefix is added to prevent 301
      // that will not be handled by NextAuth.
      authorization: {
        url: 'http://127.0.0.1:8888/en/oauth/authorize',
        params: {
          // @todo refine scope, editor (role) is used for now.
          scope: 'editor',
        },
      },
      idToken: false,
      token: 'http://127.0.0.1:8888/en/oauth/token',
      userinfo: 'http://127.0.0.1:8888/en/oauth/userinfo',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
      //theme: 'light',
    },
  ],
  theme: {
    // @todo use custom logo.
    logo: 'https://www.gatsbyjs.com/Gatsby-Monogram.svg',
    colorScheme: 'light',
    brandColor: '#663399',
  },
};

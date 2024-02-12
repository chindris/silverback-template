/** @type {import("next-auth").NextAuthOptions} */
export const authConfig = {
  // @todo set hardcoded configuration from env vars.
  providers: [
    {
      clientId: 'gatsby_editor',
      clientSecret: 'gatsby_editor',
      id: 'drupal',
      name: 'DrupalProvider',
      type: 'oauth',
      authorization: {
        url: "http://127.0.0.1:8888/en/oauth/authorize",
        params: {
          scope: "editor",
        }
      },
      idToken: false,
      token: "http://127.0.0.1:8888/en/oauth/token",
      userinfo: "http://127.0.0.1:8888/en/oauth/userinfo",
      // Make sure to request the users email address
      profile(profile) {
        console.log('Profile', profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: 'https://avatars.githubusercontent.com/u/525003?v=4'
        }
      },
      //theme: 'light',
    }
  ],
  theme: {
    logo: "https://www.gatsbyjs.com/Gatsby-Monogram.svg",
    colorScheme: "light",
    brandColor: "#663399",
  },
}

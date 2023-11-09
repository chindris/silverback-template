// Please keep this file as JavaScript.
// Gatsby supports both JS and TS config files, but the TS support is poor and
// can lead to crazy errors.
// If it's really needed to use TS (e.g. to import code from other TS files),
// use rollup to compile it to JS first. Please keep in mind that the original
// TS file name should be different from gastby-config.ts, otherwise Gatsby will
// pick it up instead of the JS file.

process.env.GATSBY_DRUPAL_URL =
  process.env.DRUPAL_EXTERNAL_URL || 'http://127.0.0.1:8888';

process.env.NETLIFY_URL = process.env.NETLIFY_URL || 'http://127.0.0.1:8000';

process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'test';
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'test';
process.env.CLOUDINARY_CLOUDNAME = process.env.CLOUDINARY_CLOUDNAME || 'demo';

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  trailingSlash: 'ignore',
  proxy: {
    prefix: '/sites/default/files',
    url: process.env.DRUPAL_EXTERNAL_URL || 'http://127.0.0.1:8888',
  },
  flags: {
    PARTIAL_HYDRATION: false,
  },
  siteMetadata: {
    // For gatsby-plugin-sitemap and gatsby-plugin-robots-txt.
    siteUrl: process.env.NETLIFY_URL,
  },
  plugins: [
    'gatsby-plugin-pnpm',
    'gatsby-plugin-layout',
    // 'gatsby-source-filesystem',
    'gatsby-plugin-sharp',
    {
      resolve: '@amazeelabs/gatsby-source-silverback',
      options: {
        drupal_url: process.env.DRUPAL_INTERNAL_URL || 'http://127.0.0.1:8888',
        drupal_external_url:
          // File requests are proxied through netlify.
          process.env.NETLIFY_URL || 'http://127.0.0.1:8000',
        graphql_path: '/graphql',
        auth_key: 'cfdb0555111c0f8924cecab028b53474',
        type_prefix: '',
      },
    },
    {
      resolve: '@amazeelabs/gatsby-silverback-cloudinary',
      options: {
        responsiveImageFields: 'MediaImage.source',
      },
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        // To avoid "X-Frame-Options: DENY" and let it work in the preview
        // iframe.
        mergeSecurityHeaders: false,
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: ['/__preview/**'],
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/', disallow: [] }],
      },
    },
  ],
};

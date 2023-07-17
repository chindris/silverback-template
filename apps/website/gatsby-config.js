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

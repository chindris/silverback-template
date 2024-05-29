import { Locale } from '@custom/schema';
import { resolve } from 'path';

/**
 *
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
export const createPages = async ({ actions }) => {
  // Create the content hub page in each language.
  Object.values(Locale).forEach((locale) => {
    actions.createPage({
      path: `/${locale}/content-hub`,
      component: resolve(`./src/templates/content-hub.tsx`),
    });
  });

  // Broken Gatsby links will attempt to load page-data.json files, which don't exist
  // and also should not be piped into the strangler function. Thats why they
  // are caught right here.
  actions.createRedirect({
    fromPath: '/page-data/*',
    toPath: '/404',
    statusCode: 404,
  });

  // @todo port Drupal webforms and other assets proxy with Cloudflare Functions.
  // // Proxy Drupal webforms.
  // Object.values(Locale).forEach((locale) => {
  //   actions.createRedirect({
  //     fromPath: `/${locale}/form/*`,
  //     toPath: `${process.env.GATSBY_DRUPAL_URL}/${locale}/form/:splat`,
  //     statusCode: 200,
  //   });
  // });
  //
  // // Additionally proxy themes and modules as they can have additional
  // // non-aggregated assets.
  // ['themes', 'modules', 'core/assets'].forEach((path) => {
  //   actions.createRedirect({
  //     fromPath: `/${path}/*`,
  //     toPath: `${process.env.GATSBY_DRUPAL_URL}/${path}/:splat`,
  //     statusCode: 200,
  //   });
  // });
};

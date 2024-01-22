import { cpSync, rmSync } from 'fs';
import serve from 'serve-static';

/**
 * @type {import('gatsby').GatsbyNode['pluginOptionsSchema']}
 */
export const pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    directories: Joi.object().pattern(Joi.string(), Joi.string()),
  });
};

/**
 * @type {import('gatsby').GatsbyNode['onPostBuild']}
 */
export const onPostBuild = (_, options) => {
  Object.keys(options.directories).forEach((src) => {
    const dest = options.directories[src];
    cpSync(src, `public${dest}`, {
      force: true,
      recursive: true,
      errorOnExist: false,
    });
  });
};

/**
 * @type {import('gatsby').GatsbyNode['onCreateDevServer']}
 */
export const onCreateDevServer = ({ app }, options) => {
  Object.keys(options.directories).forEach((src) => {
    const dest = options.directories[src];
    app.use(dest, serve(src));
  });
};

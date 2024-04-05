import config from './gatsby-config.mjs';

if (config.plugins?.filter((plugin) => plugin === '@custom/cms').length) {
  process.exit(0);
}
process.exit(1);

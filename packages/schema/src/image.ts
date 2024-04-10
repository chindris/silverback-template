import type { GraphQLFieldResolver } from 'graphql';
import sizeOf from 'image-size';
import { lookup } from 'mime-types';

export const imageProps: GraphQLFieldResolver<string, any> = (source) => {
  // If its a decap image, process it.
  // Otherwise, it comes from Drupal and
  // already has all necessary props.
  if (source && source.startsWith('/apps/decap')) {
    const relativeSource = source.substring(`/apps/decap`.length);
    const dimensions = sizeOf(`node_modules/@custom/decap/${relativeSource}`);
    const imageSrc = `${
      process.env.GATSBY_PUBLIC_URL || 'node_modules/@custom/decap'
    }${relativeSource}`;

    return JSON.stringify({
      src: imageSrc,
      originalSrc: imageSrc,
      width: dimensions.width || 0,
      height: dimensions.height || 0,
      mime: lookup(relativeSource) || 'application/octet-stream',
    });
  }
  // Otherwise, replace NETLIFY_URL with DRUPAL_EXTERNAL_URL.
  // - If images are processed in Gatsby, they have to be loaded from Drupal directly.
  // - If images are processed in Cloudinary, we don't need two CDN's (Netlify & Cloudinary)
  // - TODO: Once we have image processing in Drupal, it has to be handled here.
  if (process.env.NETLIFY_URL && process.env.DRUPAL_EXTERNAL_URL) {
    return source.replaceAll(
      process.env.NETLIFY_URL,
      process.env.DRUPAL_EXTERNAL_URL,
    );
  }
  return source;
};

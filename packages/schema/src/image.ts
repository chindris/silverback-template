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
      process.env.GATSBY_PUBLIC_URL || 'http://localhost:8000'
    }${relativeSource}`;

    return JSON.stringify({
      src: imageSrc,
      originalSrc: imageSrc,
      width: dimensions.width || 0,
      height: dimensions.height || 0,
      mime: lookup(relativeSource) || 'application/octet-stream',
    });
  }
  return source;
};

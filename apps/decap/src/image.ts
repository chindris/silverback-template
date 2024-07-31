import type { GraphQLFieldResolver } from 'graphql';
import sizeOf from 'image-size';
import { lookup } from 'mime-types';

export const imageProps: GraphQLFieldResolver<string, any> = (source) => {
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
};

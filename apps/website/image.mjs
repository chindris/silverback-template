import sizeOf from 'image-size';
import mime from 'mime-types';

// TODO: Move to shared package.
export function imageProps(source) {
  // If its a decap image, process it.
  // Otherwise, it comes from Drupal and
  // already has all necessary props.
  if (source.startsWith('/apps/decap')) {
    const relativeSource = source.substring(`/apps/decap`.length);
    const dimensions = sizeOf(`node_modules/@custom/decap/${relativeSource}`);

    console.log('process.env.GATSBY_PUBLIC_URL', process.env.GATSBY_PUBLIC_URL);
    return JSON.stringify({
      src: `${
        process.env.GATSBY_PUBLIC_URL || 'http://localhost:8000'
      }${relativeSource}`,
      width: dimensions.width || 0,
      height: dimensions.height || 0,
      mime: mime.lookup(relativeSource) || 'application/octet-stream',
    });
  }
  return source;
}
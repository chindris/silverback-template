import { readFileSync } from 'fs';
import { fluid } from 'gatsby-plugin-sharp';
import {
  createFileNodeFromBuffer,
  createRemoteFileNode,
} from 'gatsby-source-filesystem';
import type { GraphQLFieldResolver } from 'graphql';
import sizeOf from 'image-size';
import { lookup } from 'mime-types';

const AREA_FALLBACK = 'attention';

export const imageProps: GraphQLFieldResolver<string, any> = (source) => {
  // If it's a Decap image, process it.
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
    try {
      const decoded = JSON.parse(source);
      if (decoded && typeof decoded === 'object') {
        for (const key in decoded) {
          if (typeof decoded[key] === 'string') {
            decoded[key] = decoded[key].replaceAll(
              process.env.NETLIFY_URL,
              process.env.DRUPAL_EXTERNAL_URL,
            );
          }
        }
        return JSON.stringify(decoded);
      }
    } catch (error) {
      return source;
    }
  }
  return source;
};

function determineCropFocus(filename: string) {
  if (filename.includes('.c.')) return 'center';
  if (filename.includes('.nw_.')) return 'northwest';
  if (filename.includes('.w.')) return 'west';
  if (filename.includes('.sw_.')) return 'southwest';
  if (filename.includes('.s.')) return 'south';
  if (filename.includes('.se_.')) return 'southeast';
  if (filename.includes('.e.')) return 'east';
  if (filename.includes('.ne_.')) return 'northeast';
  if (filename.includes('.n.')) return 'north';
  return null;
}

const calculateCropArea = (
  width: number,
  height: number,
  x: number,
  y: number,
) => {
  if ((x === 0 && y === 0) || width === 0 || height === 0) {
    return AREA_FALLBACK;
  }
  // Adjust if Y === height or X === width as
  // the division result will produce 1,
  // which will not be a valid index
  // for the areas array (out of bounds).
  const adjustedY = y === height ? y - 1 : y;
  const adjustedX = x === width ? x - 1 : x;

  const row = Math.floor((adjustedY / height) * 3);
  const col = Math.floor((adjustedX / width) * 3);
  const areas = [
    ['northwest', 'north', 'northeast'],
    ['west', 'center', 'east'],
    ['southwest', 'south', 'southeast'],
  ];

  // If we met an exception in the calculation of the area,
  // use the fallback value.
  if (!areas[row] || !areas[row][col]) {
    return AREA_FALLBACK;
  }

  return areas[row][col];
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export const responsiveImage: GraphQLFieldResolver<string, any> = async (
  originalImage,
  args,
  context,
) => {
  const responsiveImage = JSON.parse(originalImage);
  const { cache, createNode, createNodeId, reporter } = context.api;
  try {
    const responsiveImageResult = {
      ...responsiveImage,
      originalSrc: isValidUrl(responsiveImage.src)
        ? new URL(responsiveImage.src).pathname
        : responsiveImage.src,
    };

    // If no config object is given, or no width is specified, we just return
    // the original image url.
    if (typeof args === 'undefined' || typeof args.width === 'undefined') {
      return JSON.stringify(responsiveImageResult);
    }

    const file = isValidUrl(responsiveImage.src)
      ? await createRemoteFileNode({
          url: responsiveImage.src,
          cache: cache,
          createNode: createNode,
          createNodeId: createNodeId,
        })
      : await createFileNodeFromBuffer({
          buffer: readFileSync(responsiveImage.src),
          cache: cache,
          createNode: createNode,
          createNodeId: createNodeId,
        });
    const width = args.width;
    const height = args.height || undefined;
    const breakpoints =
      args.sizes && args.sizes.length > 0
        ? args.sizes.map((item: any) => {
            // If the sizes array contains tuples, then just return the first item
            // to be added to the breakpoints elements.
            if (Array.isArray(item)) {
              return item[0];
            }
            return item;
          })
        : undefined;

    const fluidFileResult = await fluid({
      file,
      args: {
        maxWidth: width,
        maxHeight: height,
        quality: 90,
        srcSetBreakpoints: breakpoints,
        cropFocus:
          determineCropFocus(responsiveImage.src) ||
          calculateCropArea(
            parseInt(responsiveImage.width),
            parseInt(responsiveImage.height),
            parseInt(responsiveImage.focalPoint?.x),
            parseInt(responsiveImage.focalPoint?.y),
          ),
      },
      reporter: reporter,
      cache: cache,
    });
    responsiveImageResult.src = fluidFileResult.src;
    responsiveImageResult.width = fluidFileResult.presentationWidth;
    responsiveImageResult.height = fluidFileResult.presentationHeight;
    responsiveImageResult.sizes = fluidFileResult.sizes;
    responsiveImageResult.srcset = fluidFileResult.srcSet;

    return JSON.stringify(responsiveImageResult);
  } catch (err) {
    console.error(`Error loading image ${responsiveImage.src}`, err);
    return JSON.stringify(responsiveImage);
  }
};

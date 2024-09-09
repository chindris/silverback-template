import { fluid } from 'gatsby-plugin-sharp';
import { createRemoteFileNode } from 'gatsby-source-filesystem';

const AREA_FALLBACK = 'attention';

function determineCropFocus(filename) {
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

function calculateCropArea(width, height, x, y) {
  if ((x === 0 && y === 0) || (width === 0 || height === 0)) {
    return AREA_FALLBACK;
  }

  console.log('croparea', width, height, x, y);
  // Adjust if Y === height or X === width as
  // the division result will produce 1,
  // which will not be a valid index
  // for the areas array (out of bounds).
  const adjustedY = y === height ? y - 1 : y;
  const adjustedX = x === width ? x - 1 : x;

  const row = Math.floor(adjustedY / height * 3);
  const col = Math.floor(adjustedX / width * 3);
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
}

export const responsiveImageSharp = async (originalImage, args, context) => {
  const responsiveImage = JSON.parse(originalImage);
  const { cache, createNode, createNodeId, reporter } = context.api;
  console.log('here responsiveImageSharp', responsiveImage, args, context);
  try {
    const responsiveImageResult = {
      ...responsiveImage,
      originalSrc: new URL(responsiveImage.src).pathname,
    };

    // If no config object is given, or no width is specified, we just return
    // the original image url.
    if (typeof args === 'undefined' || typeof args.width === 'undefined') {
      return JSON.stringify(responsiveImageResult);
    }

    const file = await createRemoteFileNode({
      url: responsiveImage.src,
      cache: cache,
      createNode: createNode,
      createNodeId: createNodeId,
    });
    const width = args.width;
    const height = args.height || undefined;
    const breakpoints =
      args.sizes && args.sizes.length > 0
        ? args.sizes.map((item) => {
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
          determineCropFocus(responsiveImage.src) || calculateCropArea(width, height, responsiveImage.focalPoint.x, responsiveImage.focalPoint.y),
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
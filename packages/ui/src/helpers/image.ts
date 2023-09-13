import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  { src, width, height }: Parameters<typeof buildResponsiveImage>[1],
  config?: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      cloudname: 'test',
      key: 'test',
      secret: 'test',
    },
    { src, width, height },
    {
      ...config,
      width: config?.width || width,
      height:
        config?.height ||
        (config?.width ? config.width * (height / width) : height),
    },
  ) as ImageSource;
}

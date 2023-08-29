import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  { src, width, height }: Parameters<typeof buildResponsiveImage>[1],
  config?: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      cloudname: 'demo',
      key: 'c7d2fe',
      secret: '4e46e5',
    },
    { src, width, height },
  ) as ImageSource;
}

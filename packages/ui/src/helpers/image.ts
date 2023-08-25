import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  props: Parameters<typeof buildResponsiveImage>[1],
  config?: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      cloudname: 'demo',
      key: 'c7d2fe',
      secret: '4e46e5',
    },
    props,
    config,
  ) as ImageSource;
}

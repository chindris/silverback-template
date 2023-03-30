import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';
import isChromatic from 'chromatic/isChromatic';

export function image(
  url: string,
  config: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      // test
      cloudname: isChromatic() ? 'test' : 'debug',
      key: 'c7d2fe',
      secret: '4e46e5',
    },
    url,
    config,
  ) as ImageSource;
}

import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  url: string,
  config: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      cloudname: 'debug',
      key: 'foo',
      secret: 'bar',
    },
    url,
    config,
  ) as ImageSource;
}

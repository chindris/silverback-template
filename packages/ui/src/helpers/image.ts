import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  url: string,
  config: Parameters<typeof buildResponsiveImage>[2],
) {
  return buildResponsiveImage(
    {
      cloudname: 'test',
      key: 'c7d2fe',
      secret: '4e46e5',
    },
    url,
    config,
  ) as ImageSource;
}

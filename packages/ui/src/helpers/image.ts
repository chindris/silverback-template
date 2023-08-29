import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';
import { ImageSource } from '@custom/schema';

export function image(
  { src, width, height }: Parameters<typeof buildResponsiveImage>[1],
  config?: Parameters<typeof buildResponsiveImage>[2],
) {
  const img = buildResponsiveImage(
    {
      cloudname: import.meta.env.VITE_CLOUDINARY_CLOUDNAME || 'placeholder',
      key: 'c7d2fe',
      secret: '4e46e5',
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
  return img;
}

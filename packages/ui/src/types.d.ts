declare module '*as=metadata' {
  import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';

  const content: Parameters<typeof buildResponsiveImage>[1];
  export default content;
}

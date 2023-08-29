declare module '*as=metadata' {
  import { buildResponsiveImage } from '@amazeelabs/cloudinary-responsive-image';

  const content: Parameters<typeof buildResponsiveImage>[1];
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUDNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

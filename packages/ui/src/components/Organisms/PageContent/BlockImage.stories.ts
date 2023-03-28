import { Markup } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../../helpers/image';
import { BlockImage } from './BlockImage';

export default {
  component: BlockImage,
} satisfies Meta<typeof BlockImage>;

export const Landscape = {
  args: {
    source: image('/landscape.jpg', {
      width: 768,
      height: 512,
    }),
    alt: 'Landscape',
  },
} satisfies StoryObj<typeof BlockImage>;

export const Portrait = {
  args: {
    source: image('/portrait.jpg', {
      width: 768,
      height: 1024,
    }),
    alt: 'Portrait',
  },
} satisfies StoryObj<typeof BlockImage>;

export const WithCaption = {
  args: {
    ...Landscape.args,
    caption: `This <em>is</em> a <strong>caption</strong>.` as Markup,
  },
} satisfies StoryObj<typeof BlockImage>;

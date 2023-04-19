import { Markup } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../../helpers/image';
import { BlockImage } from './BlockImage';

export default {
  component: BlockImage,
} satisfies Meta<typeof BlockImage>;

export const Landscape = {
  args: {
    image: {
      source: image(
        { src: '/landscape.jpg', width: 1000, height: 1000 },
        {
          width: 768,
          height: 512,
        },
      ),
    },
    alt: 'Landscape',
  },
} satisfies StoryObj<typeof BlockImage>;

export const Portrait = {
  args: {
    image: {
      source: image(
        { src: '/portrait.jpg', width: 1000, height: 1000 },
        {
          width: 768,
          height: 1024,
        },
      ),
    },
    alt: 'Portrait',
  },
} satisfies StoryObj<typeof BlockImage>;

export const WithCaption = {
  args: {
    ...Landscape.args,
    caption: `This <em>is</em> a <strong>caption</strong>.` as Markup,
  },
} satisfies StoryObj<typeof BlockImage>;

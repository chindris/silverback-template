import { Markup } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../../helpers/image';
import { BlockMedia } from './BlockMedia';

export default {
  component: BlockMedia,
} satisfies Meta<typeof BlockMedia>;

export const ImageLandscape = {
  args: {
    media: {
      __typename: 'MediaImage',
      source: image(
        { src: '/landscape.jpg', width: 1000, height: 1000 },
        {
          width: 768,
          height: 512,
        },
      ),
      alt: 'Landscape',
    },
  },
} satisfies StoryObj<typeof BlockMedia>;

export const ImagePortrait = {
  args: {
    media: {
      __typename: 'MediaImage',
      source: image(
        { src: '/portrait.jpg', width: 1000, height: 1000 },
        {
          width: 768,
          height: 1024,
        },
      ),
      alt: 'Portrait',
    },
  },
} satisfies StoryObj<typeof BlockMedia>;

export const WithCaption = {
  args: {
    ...ImageLandscape.args,
    caption: `This <em>is</em> a <strong>caption</strong>.` as Markup,
  },
} satisfies StoryObj<typeof BlockMedia>;

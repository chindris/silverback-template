import { Markup } from '@custom/schema';
import Landscape from '@stories/landscape.jpg?as=metadata';
import Portrait from '@stories/portrait.jpg?as=metadata';
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
      source: image(Landscape),
      alt: 'Landscape',
    },
  },
} satisfies StoryObj<typeof BlockMedia>;

export const ImagePortrait = {
  args: {
    media: {
      __typename: 'MediaImage',
      source: image(Portrait),
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

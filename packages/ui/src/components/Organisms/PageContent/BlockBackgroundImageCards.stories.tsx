import { Url } from '@custom/schema';
import Landscape from '@stories/landscape.jpg?as=metadata';
import Portrait from '@stories/portrait.jpg?as=metadata';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../../helpers/image';
import { BlockBackgroundImageCards } from './BlockBackgroundImageCards';

export default {
  component: BlockBackgroundImageCards,
} satisfies Meta<typeof BlockBackgroundImageCards>;

export const Default = {
  args: {
    teasers: [
      {
        title: 'Title',
        ctaText: 'Call to action',
        ctaUrl: '/test' as Url,
        image: {
          source: image(Landscape),
          alt: 'Alt text',
        },
      },
      {
        title: 'Title',
        ctaText: 'Call to action',
        ctaUrl: '/test' as Url,
        image: {
          source: image(Portrait),
          alt: 'Alt text',
        },
      },
    ],
  },
} satisfies StoryObj<typeof BlockBackgroundImageCards>;

import { Meta, StoryObj } from '@storybook/react';

import { WithCaption } from '../Organisms/PageContent/BlockImage.stories';
import { Mixed, Paragraph } from '../Organisms/PageContent/BlockText.stories';
import { Page } from './Page';
import { image } from '../../helpers/image';

export default {
  component: Page,
} satisfies Meta<typeof Page>;

export const Default = {
  args: {
    page: {
      title: 'Page Title',
      hero: {
        headline: 'Page Hero Headline',
      },
      content: [
        {
          __typename: 'BlockText',
          ...Mixed.args,
        },
        {
          __typename: 'BlockImage',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockText',
          ...Paragraph.args,
        },
      ],
    },
  },
} satisfies StoryObj<typeof Page>;

export const FullHero = {
  args: {
    page: {
      title: 'Page Title',
      hero: {
        headline: 'Page Hero Headline',
        lead: 'A longer lead text that even might break into multiple lines.',
        image: {
          source: image(
            { src: '/landscape.jpg', width: 1000, height: 1000 },
            { width: 2000 },
          ),
          alt: 'Stock photo landscape hero.',
        },
      },
      content: [
        {
          __typename: 'BlockText',
          ...Mixed.args,
        },
        {
          __typename: 'BlockImage',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockText',
          ...Paragraph.args,
        },
      ],
    },
  },
} satisfies StoryObj<typeof Page>;

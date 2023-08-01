import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../helpers/image';
import { Filled } from '../Organisms/ContactList.stories';
import { Mixed, Paragraph } from '../Organisms/PageContent/BlockMarkup.stories';
import { WithCaption } from '../Organisms/PageContent/BlockMedia.stories';
import { Page } from './Page';

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
          __typename: 'BlockMarkup',
          ...Mixed.args,
        },
        {
          __typename: 'BlockMedia',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockMarkup',
          ...Paragraph.args,
        },
      ],
      contacts: Filled.args.contacts,
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
          __typename: 'BlockMarkup',
          ...Mixed.args,
        },
        {
          __typename: 'BlockMedia',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockMarkup',
          ...Paragraph.args,
        },
      ],
    },
  },
} satisfies StoryObj<typeof Page>;

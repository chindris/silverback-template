import { Meta, StoryObj } from '@storybook/react';

import { WithCaption } from '../Organisms/PageContent/BlockImage.stories';
import { Mixed, Paragraph } from '../Organisms/PageContent/BlockText.stories';
import { Page } from './Page';

export default {
  component: Page,
} satisfies Meta<typeof Page>;

export const Default = {
  args: {
    page: {
      title: 'Page Title',
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

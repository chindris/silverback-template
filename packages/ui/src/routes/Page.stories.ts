import { Meta, StoryObj } from '@storybook/react';

import { Page } from './Page';

export default {
  component: Page,
} satisfies Meta<typeof Page>;

export const Default = {
  args: {
    page: {
      title: 'Page Title',
    },
  },
} satisfies StoryObj<typeof Page>;

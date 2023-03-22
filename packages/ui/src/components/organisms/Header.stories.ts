import { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

export default {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export const Default = {
  args: {
    mainNavigation: [],
    metaNavigation: [],
  },
} satisfies StoryObj<typeof Header>;

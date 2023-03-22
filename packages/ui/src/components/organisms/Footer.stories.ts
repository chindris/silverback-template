import { Meta, StoryObj } from '@storybook/react';

import { Footer } from './Footer';

export default {
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>;

export const Default = {
  args: {
    footerNavigation: [],
  },
} satisfies StoryObj<typeof Footer>;

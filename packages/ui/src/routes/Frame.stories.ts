import { Meta, StoryObj } from '@storybook/react';

import { Frame } from './Frame';

export default {
  component: Frame,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Frame>;

export const Default = {
  args: {
    mainNavigation: [],
    footerNavigation: [],
    metaNavigation: [],
  },
} satisfies StoryObj<typeof Frame>;

import { Meta, StoryObj } from '@storybook/react';

import { Default as Footer } from '../organisms/Footer.stories';
import { Default as Header } from '../organisms/Header.stories';
import { Frame } from './Frame';

export default {
  component: Frame,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Frame>;

export const Default = {
  args: {
    ...Header.args,
    ...Footer.args,
  },
} satisfies StoryObj<typeof Frame>;

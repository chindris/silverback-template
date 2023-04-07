import { Meta, StoryObj } from '@storybook/react';

import { Default as Footer } from '../Organisms/Footer.stories';
import { Default as Header } from '../Organisms/Header.stories';
import { Frame } from './Frame';

export default {
  component: Frame,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Frame>;

export const Default = {
  args: {
    header: Header.args,
    footer: Footer.args,
  },
} satisfies StoryObj<typeof Frame>;

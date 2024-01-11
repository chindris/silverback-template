import './cms.css';

import { Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { BlockForm } from './BlockForm';

export default {
  component: BlockForm,
} satisfies Meta<typeof BlockForm>;

export const Base = {
  args: {
    url: 'foo/index.html' as Url,
  },
} satisfies StoryObj<typeof BlockForm>;

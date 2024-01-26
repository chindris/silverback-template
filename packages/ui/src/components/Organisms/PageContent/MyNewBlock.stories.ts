import { Meta, StoryObj } from '@storybook/react';

import { MyNewBlock } from './MyNewBlock';

export default {
  component: MyNewBlock,
} satisfies Meta;

export const Test = {} satisfies StoryObj<typeof MyNewBlock>;

import { Meta, StoryObj } from '@storybook/react';

import { ContactForm as Component } from './ContactForm';

export default {
  component: Component,
} satisfies Meta<typeof Component>;

export const Empty = {} satisfies StoryObj<typeof Component>;

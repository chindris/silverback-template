import { Meta, StoryObj } from '@storybook/react';

import { Full, Minimal } from '../Molecules/ContactCard.stories';
import { ContactList } from './ContactList';

export default {
  component: ContactList,
} satisfies Meta<typeof ContactList>;

export const Empty = {
  args: {
    contacts: [],
  },
} satisfies StoryObj<typeof ContactList>;

export const Filled = {
  args: {
    contacts: [
      Full.args,
      Minimal.args,
      Minimal.args,
      Full.args,
      Minimal.args,
      Minimal.args,
      Full.args,
      Full.args,
      Full.args,
      Minimal.args,
      Minimal.args,
      Minimal.args,
    ],
  },
} satisfies StoryObj<typeof ContactList>;

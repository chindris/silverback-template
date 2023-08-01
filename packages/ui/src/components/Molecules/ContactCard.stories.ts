import { ContactFragment } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { image } from '../../helpers/image';
import { ContactCard } from './ContactCard';

export default {
  component: ContactCard,
} satisfies Meta;

export const Minimal = {
  args: {
    email: 'john.doe@localhost',
    name: 'John Doe',
    role: 'CEO',
  },
} satisfies StoryObj<ContactFragment>;

export const Full = {
  args: {
    portrait: image(
      { src: '/portrait.jpg', width: 200, height: 200 },
      {
        width: 200,
        height: 200,
      },
    ),
    email: 'john.doe@localhost',
    name: 'John Doe',
    role: 'CEO',
    phone: '+123456',
  },
} satisfies StoryObj<ContactFragment>;

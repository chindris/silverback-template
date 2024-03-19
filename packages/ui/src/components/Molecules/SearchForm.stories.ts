import { Meta, StoryObj } from '@storybook/react';

import { SearchForm as Component } from './SearchForm.js';

export default {
  component: Component,
} satisfies Meta<typeof Component>;

export const Empty = {} satisfies StoryObj<typeof Component>;
export const Prefilled: StoryObj<typeof Component> = {
  parameters: {
    location: new URL('local:/?keyword=Foobar'),
  },
};

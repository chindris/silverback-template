import { Meta, StoryObj } from '@storybook/react';

import { SearchForm as Component } from './SearchForm';

const termOptions = ['Block', '- List', 'Demo', 'Page'];

export default {
  component: Component,
  args: {
    termOptions: termOptions,
  },
} satisfies Meta<typeof Component>;

export const Empty = {} satisfies StoryObj<typeof Component>;
export const Prefilled: StoryObj<typeof Component> = {
  parameters: {
    location: new URL('local:/?keyword=Foobar&terms=Demo'),
  },
};

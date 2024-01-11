import { Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { BlockForm } from './BlockForm';
import cmsCss from './cms.css?inline';

export default {
  component: BlockForm,
} satisfies Meta<typeof BlockForm>;

export const Base = {
  args: {
    url: 'foo/index.html' as Url,
    cssStylesToInject: cmsCss,
  },
} satisfies StoryObj<typeof BlockForm>;

import { Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import cmsCss from '../../../iframe.css?inline';
import { BlockForm } from './BlockForm';

export default {
  component: BlockForm,
} satisfies Meta<typeof BlockForm>;

export const Idle = {
  args: {
    url: 'webforms/idle/index.html' as Url,
    cssStylesToInject: cmsCss,
  },
} satisfies StoryObj<typeof BlockForm>;

export const Error = {
  args: {
    url: 'webforms/error/index.html' as Url,
    cssStylesToInject: cmsCss,
  },
} satisfies StoryObj<typeof BlockForm>;

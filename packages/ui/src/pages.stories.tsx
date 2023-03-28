import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Frame } from './components/Routes/Frame';
import { Default as FrameStory } from './components/Routes/Frame.stories';
import { Page } from './components/Routes/Page';
import { Default as PageStory } from './components/Routes/Page.stories';

export default {
  title: 'Pages',
  parameters: {
    chromatic: {
      // We don't want to snapshot page examples, that just causes a lot of noise.
      disableSnapshot: true,
    },
  },
} satisfies Meta;

export const ContentPage = (() => (
  <Frame {...FrameStory.args}>
    <Page {...PageStory.args} />
  </Frame>
)) satisfies StoryFn;

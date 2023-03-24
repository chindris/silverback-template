import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Frame } from './components/routes/Frame';
import { Default as FrameStory } from './components/routes/Frame.stories';
import { Page } from './components/routes/Page';
import { Default as PageStory } from './components/routes/Page.stories';

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

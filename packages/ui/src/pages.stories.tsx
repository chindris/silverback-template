import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Frame } from './components/routes/Frame';
import { Default as FrameData } from './components/routes/Frame.stories';
import { Page } from './components/routes/Page';
import { Default } from './components/routes/Page.stories';

export default {
  title: 'Pages',
} satisfies Meta;

export const ContentPage = (() => (
  <Frame {...FrameData.args}>
    <Page {...Default.args} />
  </Frame>
)) satisfies StoryFn;

import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Frame } from './routes/Frame';
import { Default as FrameData } from './routes/Frame.stories';
import { Page } from './routes/Page';
import { Default } from './routes/Page.stories';

export default {
  title: 'Pages',
} satisfies Meta;

export const ContentPage = (() => (
  <Frame {...FrameData.args}>
    <Page {...Default.args} />
  </Frame>
)) satisfies StoryFn;

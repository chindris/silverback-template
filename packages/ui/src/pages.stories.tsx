import {
  ContentHubQuery,
  FrameQuery,
  OperationExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { WithResults } from './components/Organisms/ContentHub.stories';
import { ContentHub } from './components/Routes/ContentHub';
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

export const ContentPage = (() => {
  return (
    <OperationExecutor executor={PageStory.args} id={ViewPageQuery}>
      <OperationExecutor executor={FrameStory.args} id={FrameQuery}>
        <Frame>
          <Page />
        </Frame>
      </OperationExecutor>
    </OperationExecutor>
  );
}) satisfies StoryFn;

export const ContentHubPage = (() => {
  return (
    <OperationExecutor executor={FrameStory.args} id={FrameQuery}>
      <OperationExecutor executor={WithResults.args.exec} id={ContentHubQuery}>
        <Frame>
          <ContentHub pageSize={6} />
        </Frame>
      </OperationExecutor>
    </OperationExecutor>
  );
}) satisfies StoryFn;

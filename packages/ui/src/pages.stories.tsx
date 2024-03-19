import {
  ContentHubQuery,
  FrameQuery,
  registerExecutor,
  ViewPageQuery,
} from '@custom/schema';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { WithResults } from './components/Organisms/ContentHub.stories.js';
import { ContentHub } from './components/Routes/ContentHub.js';
import { Frame } from './components/Routes/Frame.js';
import { Default as FrameStory } from './components/Routes/Frame.stories.js';
import { Page } from './components/Routes/Page.js';
import { Default as PageStory } from './components/Routes/Page.stories.js';

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
  registerExecutor(FrameQuery, () => FrameStory.args);
  registerExecutor(ViewPageQuery, () => PageStory.args);
  return (
    <Frame>
      <Page />
    </Frame>
  );
}) satisfies StoryFn;

export const ContentHubPage = (() => {
  registerExecutor(FrameQuery, () => FrameStory.args);
  registerExecutor(ContentHubQuery, WithResults.args.exec);
  return (
    <Frame>
      <ContentHub pageSize={6} />
    </Frame>
  );
}) satisfies StoryFn;

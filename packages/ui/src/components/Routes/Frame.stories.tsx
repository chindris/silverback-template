import { FrameQuery, registerExecutor } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Footer as FooterStory } from '../Organisms/Footer.stories.js';
import { Idle as HeaderStory } from '../Organisms/Header.stories.js';
import { Frame } from './Frame.js';

export default {
  component: Frame,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Frame>;

export const Default = {
  render: (args) => {
    registerExecutor(FrameQuery, () => args);
    return <Frame />;
  },
  args: {
    mainNavigation: HeaderStory.args.mainNavigation,
    footerNavigation: FooterStory.args.footerNavigation,
    stringTranslations: [],
  },
} satisfies StoryObj<FrameQuery>;

import { FrameQuery, OperationExecutor } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Default as FrameStory } from '../Routes/Frame.stories';
import BreadCrumbs from './Breadcrumbs';

export default {
  component: BreadCrumbs,
  parameters: {
    layout: 'fullscreen',
    location: { pathname: '/gatsby-turbo' },
  },
} satisfies StoryObj<typeof BreadCrumbs>;

export const Default = {
  render: () => {
    return (
      <OperationExecutor executor={FrameStory.args} id={FrameQuery}>
        <BreadCrumbs />
      </OperationExecutor>
    );
  },
};

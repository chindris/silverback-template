import { FrameQuery, OperationExecutorsProvider } from '@custom/schema';
import { Meta } from '@storybook/react';
import React from 'react';

import { Default as FrameStory } from '../Routes/Frame.stories';
import { BreadCrumbs } from './Breadcrumbs';

export default {
  component: BreadCrumbs,
  parameters: {
    layout: 'fullscreen',
    location: new URL('local:/gatsby-turbo'),
  },
} satisfies Meta<typeof BreadCrumbs>;

export const Default = {
  render: () => {
    return (
      <OperationExecutorsProvider
        executors={[{ executor: FrameStory.args, id: FrameQuery }]}
      >
        <BreadCrumbs />
      </OperationExecutorsProvider>
    );
  },
};

import {
  FrameQuery,
  Locale,
  registerExecutor,
  Url,
  ViewPageQuery,
} from '@custom/schema';
import Landscape from '@stories/landscape.jpg?as=metadata';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { image } from '../../helpers/image';
import { Mixed, Paragraph } from '../Organisms/PageContent/BlockMarkup.stories';
import { WithCaption } from '../Organisms/PageContent/BlockMedia.stories';
import { Default as FrameStory } from './Frame.stories';
import { Page } from './Page';

export default {
  component: Page,
} satisfies Meta<typeof Page>;

export const Default = {
  render: (args) => {
    registerExecutor(ViewPageQuery, () => args);
    registerExecutor(FrameQuery, FrameStory.args);
    return <Page />;
  },
  args: {
    page: {
      title: 'Page Title',
      locale: 'en',
      translations: [
        {
          locale: Locale.En,
          path: '/test' as Url,
        },
      ],
      path: '/test' as Url,
      hero: {
        headline: 'Page Hero Headline',
      },
      content: [
        {
          __typename: 'BlockMarkup',
          ...Mixed.args,
        },
        {
          __typename: 'BlockMedia',
          ...WithCaption.args,
        },
        {
          __typename: 'BlockMarkup',
          ...Paragraph.args,
        },
      ] as Exclude<ViewPageQuery['page'], undefined>['content'],
    },
  },
} satisfies StoryObj<ViewPageQuery>;

export const FullHero = {
  ...Default,
  args: {
    ...Default.args,
    page: {
      ...Default.args.page,
      hero: {
        headline: 'Page Hero Headline',
        lead: 'A longer lead text that even might break into multiple lines.',
        image: {
          source: image(Landscape, { width: 2000 }),
          alt: 'Stock photo landscape hero.',
        },
      },
    },
  },
} satisfies StoryObj<ViewPageQuery>;

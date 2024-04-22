import { Url, VerticalPosition } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { BlockCta } from './BlockCta';

export default {
  component: BlockCta,
} satisfies Meta<typeof BlockCta>;

export const BlockCtaDefault = {
  args: {
    text: 'Support center',
    url: 'https://example.com' as Url,
    openInNewTab: false,
    displayIcon: true,
    iconPosition: VerticalPosition.Right,
  },
} satisfies StoryObj<typeof BlockCta>;

export const BlockCtaStoryIconLeft = {
  args: {
    text: 'Support center',
    url: 'https://example.com' as Url,
    openInNewTab: false,
    displayIcon: true,
    iconPosition: VerticalPosition.Left,
  },
} satisfies StoryObj<typeof BlockCta>;

export const BlockCtaStoryNoIcon = {
  args: {
    text: 'Support center',
    url: 'https://example.com' as Url,
    openInNewTab: false,
    displayIcon: false,
  },
} satisfies StoryObj<typeof BlockCta>;

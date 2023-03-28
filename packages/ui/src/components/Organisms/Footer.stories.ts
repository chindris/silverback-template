import { Locale, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

import { Footer } from './Footer';

export default {
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>;

export const Default = {
  args: {
    footerNavigation: [
      { title: 'About', target: '/about' as Url },
      { title: 'Blog', target: '/blog' as Url },
      { title: 'Jobs', target: '/jobs' as Url },
      { title: 'Press', target: '/press' as Url },
      { title: 'Accessibility', target: '/accessibility' as Url },
      { title: 'Partners', target: '/partners' as Url },
    ].map((item, index) => ({
      ...item,
      id: index.toString(),
      locale: 'en' as Locale,
    })),
  },
} satisfies StoryObj<typeof Footer>;

import { FrameQuery, Locale, registerExecutor, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Footer as Component } from './Footer.js';

export default {
  component: Component,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Component>;

export const Footer = {
  render: (args) => {
    registerExecutor(FrameQuery, () => args);
    return <Component />;
  },
  args: {
    footerNavigation: [
      {
        locale: Locale.En,
        items: [
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
    ],
  },
} satisfies StoryObj<FrameQuery>;

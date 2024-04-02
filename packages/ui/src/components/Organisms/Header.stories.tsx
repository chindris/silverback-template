import { FrameQuery, Locale, OperationExecutor, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import React from 'react';

import { Header } from './Header';

export default {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  excludeStories: /^Fixture/,
} satisfies Meta<typeof Header>;

export const Idle = {
  render: (args) => {
    return (
      <OperationExecutor id={FrameQuery} executor={() => args}>
        <Header />
      </OperationExecutor>
    );
  },
  args: {
    mainNavigation: [
      {
        locale: Locale.En,
        items: [
          {
            id: '1',
            title: 'Home',
            target: '/' as Url,
          },
          {
            id: '2',
            title: 'Products',
            target: '/products' as Url,
          },
          {
            id: '3',
            title: 'About us',
            target: '/about' as Url,
          },
          {
            id: '4',
            title: 'Blog',
            target: '/blog' as Url,
          },
          {
            id: '5',
            title: 'Drupal',
            target: '/drupal' as Url,
            parent: '2',
          },
          {
            id: '6',
            title: 'Gatsby',
            target: '/gatsby' as Url,
            parent: '2',
          },
          {
            id: '7',
            title: 'Gatsby Turbo',
            target: '/gatsby-turbo' as Url,
            parent: '6',
          },
          {
            id: '8',
            title: 'Super Gatsby Turbo',
            target: '/gatsby-turbo' as Url,
            parent: '6',
          },
        ],
      },
    ],
  },
} satisfies StoryObj<FrameQuery>;

export const Expanded: StoryObj<FrameQuery> = {
  ...Idle,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = within(
      await canvas.findByRole('navigation', { name: 'Global' }),
    );
    const mobileMenuButton = navigation.queryByRole('button', {
      name: 'Open main navigation',
    });
    if (mobileMenuButton) {
      await userEvent.click(mobileMenuButton, {
        delay: 100, // The mobile navigation does not appear randomly without this delay.
      });
      const dialog = within(
        await within(canvasElement.parentElement!).findByRole('dialog'),
      );
      await userEvent.click(
        await dialog.findByRole('button', { name: 'Products' }),
      );
      await dialog.findByRole('link', { name: 'Drupal' });
    } else {
      await userEvent.click(
        await navigation.findByRole('button', { name: 'Products' }),
      );
      userEvent.click(
        await navigation.findByRole('button', { name: 'Gatsby' }),
      );
      await navigation.findByRole('link', { name: 'Gatsby Turbo' });
    }
  },
};

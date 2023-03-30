import { Locale, NavigationItemFragment, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import Header from './Header';

export default {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

const MainMenuItems: Array<NavigationItemFragment> = [
  {
    id: '1',
    title: 'Home',
    target: '/' as Url,
    locale: 'en' as Locale,
  },
  {
    id: '2',
    title: 'Products',
    target: '/products' as Url,
    locale: 'en' as Locale,
  },
  {
    id: '3',
    title: 'About us',
    target: '/about' as Url,
    locale: 'en' as Locale,
  },
  {
    id: '4',
    title: 'Blog',
    target: '/blog' as Url,
    locale: 'en' as Locale,
  },
  {
    id: '5',
    title: 'Drupal',
    target: '/drupal' as Url,
    locale: 'en' as Locale,
    parent: '2',
  },
  {
    id: '6',
    title: 'Gatsby',
    target: '/gatsby' as Url,
    locale: 'en' as Locale,
    parent: '2',
  },
];

export const Default = {
  args: {
    mainNavigation: MainMenuItems,
  },
} satisfies StoryObj<typeof Header>;

// Explicit annotation is necessary here because of typing issue in storybook.
// https://github.com/storybookjs/storybook/issues/20922
export const Expanded: StoryObj<typeof Header> = {
  ...Default,
  play: async ({ canvasElement }) => {
    console.log();
    const canvas = within(canvasElement);
    const navigation = within(
      await canvas.findByRole('navigation', { name: 'Global' }),
    );
    const mobileMenuButton = await navigation.queryByRole('button', {
      name: 'Open main menu',
    });
    if (mobileMenuButton) {
      userEvent.click(mobileMenuButton);
      const dialog = within(
        await within(canvasElement.parentElement!).findByRole('dialog'),
      );
      userEvent.click(await dialog.findByRole('button', { name: 'Products' }));
      await dialog.findByRole('link', { name: 'Drupal' });
    } else {
      userEvent.click(
        await navigation.findByRole('button', { name: 'Products' }),
      );
      await navigation.findByRole('link', { name: 'Drupal' });
    }
  },
};

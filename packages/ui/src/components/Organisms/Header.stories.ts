import { Locale, NavigationItemFragment, Url } from '@custom/schema';
import { Meta, StoryObj } from '@storybook/react';

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

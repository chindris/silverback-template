import { Locale, NavigationItemFragment } from '@custom/schema';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import React, { PropsWithChildren } from 'react';

// TODO: Source menu items from GraphQL.
const MainMenuItems = [
  {
    id: '1',
    title: 'Home',
    target: '/',
  },
  {
    id: '2',
    title: 'Products',
    target: '/products',
  },
  {
    id: '3',
    title: 'About us',
    target: '/about',
  },
  {
    id: '4',
    title: 'Blog',
    target: '/blog',
  },
  {
    id: '5',
    title: 'Drupal',
    target: '/drupal',
    parent: '2',
  },
  {
    id: '6',
    title: 'Gatsby',
    target: '/gatsby',
    parent: '2',
  },
] as Array<NavigationItemFragment>;

const FooterMenuItems = [
  { title: 'About', target: '/about' },
  { title: 'Blog', target: '/blog' },
  { title: 'Jobs', target: '/jobs' },
  { title: 'Press', target: '/press' },
  { title: 'Accessibility', target: '/accessibility' },
  { title: 'Partners', target: '/partners' },
].map((item, index) => {
  return {
    ...item,
    id: index.toString(),
    locale: 'en' as Locale,
  };
}) as unknown as Array<NavigationItemFragment>;

export function Wrapper({ children }: PropsWithChildren<{}>) {
  return (
    <IntlProvider locale={'en'}>
      <Frame
        header={{ mainNavigation: { items: MainMenuItems } }}
        footer={{ footerNavigation: { items: FooterMenuItems } }}
      >
        {children}
      </Frame>
    </IntlProvider>
  );
}

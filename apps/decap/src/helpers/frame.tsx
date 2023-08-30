import { Url } from '@custom/schema';
import { NavigationItemSource } from '@custom/schema/source';
import { IntlProvider } from '@custom/ui/intl';
import { Frame } from '@custom/ui/routes/Frame';
import { PropsWithChildren } from 'react';

const menuItems = (amount: number) =>
  [...Array(amount).keys()].map(
    (i) =>
      ({
        id: `${i}`,
        __typename: 'NavigationItem',
        title: `Item ${i + 1}`,
        target: '/' as Url,
      } satisfies NavigationItemSource),
  );

export function PreviewFrame({ children }: PropsWithChildren) {
  return (
    <IntlProvider locale={'en'}>
      <Frame
        header={{
          mainNavigation: {
            items: menuItems(4),
          },
        }}
        footer={{
          footerNavigation: {
            items: menuItems(4),
          },
        }}
      >
        {children}
      </Frame>
    </IntlProvider>
  );
}

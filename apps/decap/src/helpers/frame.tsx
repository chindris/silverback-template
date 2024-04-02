import { FrameQuery, Locale, OperationExecutor, Url } from '@custom/schema';
import { NavigationItemSource } from '@custom/schema/source';
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
      }) satisfies NavigationItemSource,
  );

export function PreviewFrame({ children }: PropsWithChildren) {
  return (
    <OperationExecutor
      id={FrameQuery}
      executor={{
        mainNavigation: [
          {
            locale: Locale.En,
            items: menuItems(4),
          },
        ],
        footerNavigation: [
          {
            locale: Locale.En,
            items: menuItems(4),
          },
        ],
        stringTranslations: [],
      }}
    >
      <Frame>{children}</Frame>
    </OperationExecutor>
  );
}

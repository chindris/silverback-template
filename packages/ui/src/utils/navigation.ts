import { Locale, NavigationItemFragment } from '@custom/schema';

type NavigationTreeElement = NavigationItemFragment & {
  children: Array<NavigationTreeElement>;
};

export function buildNavigationTree(
  items: Array<NavigationItemFragment>,
  locale: Locale,
): NavigationTreeElement[] {
  const localeItems = items.filter((item) => item.locale === locale);
  function buildTree(
    parent: NavigationItemFragment,
    items: Array<NavigationItemFragment>,
  ): NavigationTreeElement {
    const children = items.filter((item) => item.parent === parent?.id);
    return {
      ...parent,
      children: children.map((child) => ({
        ...child,
        children: buildTree(child, items).children,
      })),
    };
  }
  return localeItems
    .filter((item) => !item.parent)
    .map((item) => buildTree(item, localeItems));
}

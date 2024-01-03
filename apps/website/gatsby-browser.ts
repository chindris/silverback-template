import './styles.css';

import { registerExecutor } from '@custom/schema';
import { GatsbyBrowser } from 'gatsby';

import { drupalExecutor } from './src/utils/drupal-executor';

export const onClientEntry: GatsbyBrowser['onClientEntry'] = async () => {
  registerExecutor(drupalExecutor(`/graphql`));
};

export const shouldUpdateScroll: GatsbyBrowser['shouldUpdateScroll'] = (
  args,
) => {
  // Tell Gatsby to only update scroll position if the pathname or hash has changed.
  // If only the search has changed (e.g. when a search form is submitted),
  // the scroll position should remain the same.
  const current = args.routerProps.location;
  const previous = args.prevRouterProps?.location;
  return (
    current.pathname !== previous?.pathname || current.hash !== previous?.hash
  );
};

import './styles.css';

import { mockCloudinaryImage } from '@amazeelabs/cloudinary-responsive-image';
import { GatsbyBrowser } from 'gatsby';
import { rest, setupWorker } from 'msw';

export const onClientEntry: GatsbyBrowser['onClientEntry'] = () => {
  const worker = setupWorker(
    rest.get('https://res.cloudinary.com/demo/*', async (req, res, context) => {
      return res(
        context.set('Content-Type', 'image/jpg'),
        context.body((await mockCloudinaryImage(req.url.toString())) || ''),
      );
    }),
  );
  worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .then(() => {
      return window.document.dispatchEvent(new CustomEvent('MSW_READY'));
    })
    .catch(console.error);
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

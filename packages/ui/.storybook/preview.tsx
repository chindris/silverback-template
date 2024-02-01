import '../src/tailwind.css';

import { Decorator } from '@storybook/react';
import { clearRegistry, LocationProvider } from '@custom/schema';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { SWRConfig, useSWRConfig } from 'swr';

// Every story is wrapped in an IntlProvider by default.
const IntlDecorator: Decorator = (Story) => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Story />
  </IntlProvider>
);

const OperatorDecorator: Decorator = (Story) => {
  clearRegistry();
  return <Story />;
};

const LocationDecorator: Decorator = (Story, ctx) => {
  return (
    <LocationProvider currentLocation={ctx.parameters.location}>
      <Story />
    </LocationProvider>
  );
};

declare global {
  interface Window {
    __STORYBOOK_PREVIEW__: {
      currentRender: {
        id: string;
      };
    };
  }
}

const SWRCacheDecorator: Decorator = (Story) => {
  const { cache } = useSWRConfig();
  for (const key of cache.keys()) {
    cache.delete(key);
  }
  return (
    <SWRConfig
      value={{
        use: [
          (useSWR) => (key, fetcher, config) => {
            return useSWR(
              // Make sure SWR caches are unique per story.
              [key, window.__STORYBOOK_PREVIEW__.currentRender.id],
              fetcher,
              config,
            );
          },
        ],
      }}
    >
      <Story />
    </SWRConfig>
  );
};

export const parameters = {
  chromatic: { viewports: [320, 840, 1440] },
};

export const decorators = [
  LocationDecorator,
  IntlDecorator,
  OperatorDecorator,
  SWRCacheDecorator,
];

import '../tailwind.css';

import { Decorator } from '@storybook/react';
import { IntlProvider } from '../src/utils/intl';
import { LocationProvider } from '@custom/schema';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Every story is wrapped in an IntlProvider by default.
const IntlDecorator: Decorator = (Story) => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Story />
  </IntlProvider>
);

const LocationDecorator: Decorator = (Story, ctx) => {
  return (
    <LocationProvider currentLocation={ctx.parameters.location}>
      <Story />
    </LocationProvider>
  );
};

export const parameters = {
  chromatic: { viewports: [320, 840, 1440] },
};

initialize({
  onUnhandledRequest: 'bypass',
});

export const loaders = [mswLoader];

export const decorators = [LocationDecorator, IntlDecorator];

import '../tailwind.css';

import { Decorator } from '@storybook/react';
import { IntlProvider } from '../src/utils/intl';
import { LocationProvider } from '@custom/schema';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';
import { mockCloudinaryImage } from '@amazeelabs/cloudinary-responsive-image';

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
  msw: {
    handlers: {
      cloudinary: [
        rest.get('https://res.cloudinary.com/*', async (req, res, context) => {
          return res(
            context.set('Content-Type', 'image/jpg'),
            context.body((await mockCloudinaryImage(req.url.toString())) || ''),
          );
        }),
      ],
    },
  },
};

initialize({
  onUnhandledRequest: 'bypass',
});

export const decorators = [LocationDecorator, IntlDecorator, mswDecorator];

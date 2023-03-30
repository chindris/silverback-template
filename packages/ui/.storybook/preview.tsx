import '../tailwind.css';

import { Decorator } from '@storybook/react';
import { IntlProvider } from '../src/utils/intl';

// Every story is wrapped in an IntlProvider by default.
const IntlDecorator: Decorator = (Story) => (
  <IntlProvider locale={'en'} defaultLocale={'en'}>
    <Story />
  </IntlProvider>
);

export const parameters = {
  chromatic: { viewports: [320, 840, 1440] },
};

export const decorators = [IntlDecorator];

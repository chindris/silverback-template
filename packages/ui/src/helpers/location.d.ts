import type { LocationProvider } from '@custom/schema';
import { ComponentProps } from 'react';

declare module '@storybook/react' {
  interface Parameters {
    location?: ComponentProps<typeof LocationProvider>['currentLocation'];
  }
}

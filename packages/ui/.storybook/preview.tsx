import '../src/tailwind.css';

import { LocationProvider } from '@custom/schema';
import { Decorator } from '@storybook/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { SWRConfig, useSWRConfig } from 'swr';
import {
  SessionContext as NextSessionContext,
  SessionProvider,
} from 'next-auth/react';
import { faker } from '@faker-js/faker';
import { Session } from 'next-auth';
import { useMemo } from 'react';

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

type AuthState =
  | { data: Session; status: 'authenticated' }
  | { data: null; status: 'unauthenticated' | 'loading' };

export const AUTH_STATES: Record<
  string,
  { title: string; session: AuthState | undefined }
> = {
  unknown: {
    title: 'Session Unknown',
    session: undefined,
  },
  loading: {
    title: 'Session Loading',
    session: {
      data: null,
      status: 'loading',
    },
  },
  unauthenticated: {
    title: 'Not Authenticated',
    session: {
      data: null,
      status: 'unauthenticated',
    },
  },
  authenticated: {
    title: 'Authenticated',
    session: {
      data: {
        user: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          image: faker.image.avatar(),
        },
        expires: faker.date.future().toString(),
      },
      status: 'authenticated',
    },
  },
};

const SessionContext: React.FC<{ session: AuthState }> = ({
  session,
  children,
}) => {
  const value = useMemo((): AuthState => {
    return session ? session : { data: undefined, status: 'unauthenticated' };
  }, [session]);

  return <SessionProvider>{children}</SessionProvider>;
};

const SessionDecorator: Decorator = (Story, context) => {
  const session = AUTH_STATES[context.globals.authState]?.session;
  return (
    <SessionContext session={session}>
      <Story />
    </SessionContext>
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useSWR(
              // Make sure SWR caches are unique per story.
              [
                ...(key instanceof Array ? key : [key]),
                window.__STORYBOOK_PREVIEW__.currentRender.id,
              ],
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
  SWRCacheDecorator,
  SessionDecorator,
];

import type {
  LinkType,
  LocationProviderType,
  useLocationType,
} from '@amazeelabs/bridge';
import React from 'react';

export const Link: LinkType = ({ href, ...props }) => {
  return <a href={href || '/'} {...props} />;
};

export const useLocation: useLocationType = () => {
  return [
    // AXXX Maybe we can make it working using Astro.url via
    //  https://www.npmjs.com/package/astro-global
    new URL(
      typeof window !== 'undefined' ? window.location.href : 'https://foo.bar',
    ),
    (to: string) => {
      window.location.href = to;
    },
  ];
};

export const LocationProvider: LocationProviderType = ({ children }) => {
  return <>{children}</>;
};

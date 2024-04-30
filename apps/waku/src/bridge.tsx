import type {
  LinkType,
  LocationProviderType,
  useLocationType,
} from '@amazeelabs/bridge';
import React from 'react';
import { Link as WakuLink, useRouter_UNSTABLE as useRouter } from 'waku';

export const Link: LinkType = ({ href, ...props }) => {
  return <WakuLink to={href || '/'} {...props} />;
};

export const useLocation: useLocationType = () => {
  const router = useRouter();
  console.log(router);
  return [
    {
      pathname: router.path,
      search: router.searchParams?.toString() || '',
      searchParams: router.searchParams,
      // TODO: handle the hash on client side, also using server/client implementations
      hash: '',
    },
    router.push,
  ];
};

export const LocationProvider: LocationProviderType = ({ children }) => {
  return <>{children}</>;
};

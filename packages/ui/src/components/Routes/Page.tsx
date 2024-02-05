import { useLocation, ViewPageQuery } from '@custom/schema';
import React from 'react';

import { useOperation } from '../../utils/operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export function Page() {
  // Retrieve the current location and load the page
  // behind it.
  const [loc] = useLocation();
  const { data } = useOperation(ViewPageQuery, { pathname: loc.pathname });
  return data?.page ? <PageDisplay {...data.page} /> : null;
}

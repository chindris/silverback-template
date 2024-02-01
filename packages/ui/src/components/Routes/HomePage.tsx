import { HomePageQuery } from '@custom/schema';
import React from 'react';

import { useLocalized } from '../../utils/locale';
import { useOperation } from '../../utils/operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export function HomePage() {
  const { data } = useOperation(HomePageQuery);
  const page = useLocalized(data?.websiteSettings?.homePage?.translations);
  return page ? <PageDisplay {...page} /> : null;
}

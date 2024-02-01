import { NotFoundPageQuery } from '@custom/schema';
import React from 'react';

import { useLocalized } from '../../utils/locale';
import { useOperation } from '../../utils/operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export function NotFoundPage() {
  const { data } = useOperation(NotFoundPageQuery);
  const page = useLocalized(data?.websiteSettings?.notFoundPage?.translations);
  return page ? <PageDisplay {...page} /> : null;
}

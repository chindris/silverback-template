import { NotFoundPageQuery } from '@custom/schema';
import React from 'react';

import { useLocalized } from '../../utils/locale';
import { withOperation } from '../../utils/with-operation';
import { PageDisplay } from '../Organisms/PageDisplay';

export const NotFoundPage = withOperation(
  NotFoundPageQuery,
  ({ websiteSettings }) => {
    const page = useLocalized(websiteSettings?.notFoundPage?.translations);
    return page ? <PageDisplay {...page} /> : <div />;
  },
);

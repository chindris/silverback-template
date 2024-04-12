import type { OperationVariables } from '@custom/schema';
import { PreviewDrupalPageQuery, useLocation } from '@custom/schema';
import React from 'react';

import { clear, useOperation } from '../../utils/operation';
import { PageDisplay } from '../Organisms/PageDisplay';

function usePreviewParameters(): OperationVariables<
  typeof PreviewDrupalPageQuery
> {
  const [location] = useLocation();

  const nid = location.searchParams.get('nid');
  const rid = location.searchParams.get('rid');
  const lang = location.searchParams.get('lang');
  return { id: nid || '', rid: rid || '', locale: lang || 'en' };
}

export function usePreviewRefresh() {
  const params = usePreviewParameters();
  return () => clear(PreviewDrupalPageQuery, params);
}

export function Preview() {
  const { data } = useOperation(PreviewDrupalPageQuery, usePreviewParameters());
  if (data?.preview) {
    return <PageDisplay {...data.preview} />;
  }
}

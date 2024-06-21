'use client';
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
  return (input: {
    entity_type_id?: string;
    entity_id?: string;
    langcode?: string;
  }) => {
    if (
      // TODO: Extend for non-node entities?
      input.entity_type_id === 'node' &&
      input.entity_id === params.id &&
      input.langcode === params.locale
    ) {
      clear(PreviewDrupalPageQuery, params);
    }
  };
}

export function Preview() {
  const { data } = useOperation(PreviewDrupalPageQuery, usePreviewParameters());
  if (data?.preview) {
    return <PageDisplay {...data.preview} />;
  }
}

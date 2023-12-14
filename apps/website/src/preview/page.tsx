'use client';

import { PreviewPageQuery, useOperation } from '@custom/schema';
import { Loading } from '@custom/ui/routes/Loading';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';

import { usePreviewParameters } from '../utils/preview';

export default function PagePreview() {
  const { nid, rid, lang } = usePreviewParameters();
  const data = useOperation(
    `${process.env.GATSBY_DRUPAL_URL}/graphql`,
    PreviewPageQuery,
    nid && rid && lang
      ? {
          id: nid,
          rid: rid,
          locale: lang,
        }
      : undefined,
  );
  return data?.preview ? <Page page={data.preview} /> : <Loading />;
}

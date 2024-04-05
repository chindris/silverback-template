import {
  OperationExecutor,
  PreviewDrupalPageQuery,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';

import { drupalExecutor } from '../utils/drupal-executor';
import { usePreviewParameters } from '../utils/preview';

const previewExecutor = drupalExecutor(
  `${process.env.GATSBY_DRUPAL_URL}/graphql`,
  false,
);

export default function PagePreview() {
  const { nid, rid, lang } = usePreviewParameters();
  if (nid && rid && lang) {
    return (
      <OperationExecutor
        id={ViewPageQuery}
        executor={async () => {
          const data = await previewExecutor(PreviewDrupalPageQuery, {
            id: nid,
            locale: lang,
            rid,
          });
          return { page: data.preview };
        }}
      >
        <Page />
      </OperationExecutor>
    );
  }
  return null;
}

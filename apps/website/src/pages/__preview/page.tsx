import React from 'react';

import PagePreview from '../../preview/page';
import { Wrapper } from '../../utils/wrapper';

export function Head() {
  return <meta title="Page preview" />;
}

export default function PagePreviewTemplate() {
  return (
    <Wrapper>
      <PagePreview />
    </Wrapper>
  );
}

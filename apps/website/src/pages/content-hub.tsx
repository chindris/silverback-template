import { ContentHub } from '@custom/ui/routes/ContentHub';
import React from 'react';

import { Wrapper } from '../utils/wrapper';

export function Head() {
  return <meta title="Page not found" />;
}

export default function ContentHubPage() {
  return (
    <Wrapper>
      <ContentHub pageSize={6} />
    </Wrapper>
  );
}

import { Page } from '@custom/ui/routes/Page';
import React from 'react';

import { Wrapper } from '../utils/wrapper';

export function Head() {
  return <meta title="Home" />;
}

export default function Index() {
  return (
    <Wrapper>
      <Page page={{ title: 'Not found!', content: [] }} />
    </Wrapper>
  );
}

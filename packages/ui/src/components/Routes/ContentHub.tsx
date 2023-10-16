import React from 'react';

import { PageTransition } from '../Molecules/PageTransition';
import { ContentHub as ContentHubOrganism } from '../Organisms/ContentHub';

export function ContentHub(props: { pageSize: number }) {
  return (
    <PageTransition>
      <ContentHubOrganism pageSize={props.pageSize} />
    </PageTransition>
  );
}

import React from 'react';

import { ContentHub as ContentHubOrganism } from '../Organisms/ContentHub';

export function ContentHub(props: { pageSize: number }) {
  return <ContentHubOrganism pageSize={props.pageSize} />;
}

import { TeaserItemFragment } from '@custom/schema';
import React from 'react';

export function TeaserItem({
  title,
  hero,
}: TeaserItemFragment & { readMoreText?: string }) {
  return (
    <div>
      <h2>{title}</h2>
      <h3>{hero?.headline}</h3>
      <div>{hero?.lead}</div>
    </div>
  );
}

import { ContentHub } from '@custom/ui/routes/ContentHub';
import React from 'react';

export function Head() {
  // TODO: Add title once content hub is language aware.
  return null;
}

export default function ContentHubPage() {
  return <ContentHub pageSize={6} />;
}

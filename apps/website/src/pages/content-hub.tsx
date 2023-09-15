import { ContentHub } from '@custom/ui/routes/ContentHub';
import React from 'react';

export function Head() {
  return <meta title="Page not found" />;
}

export default function ContentHubPage() {
  return <ContentHub pageSize={6} />;
}

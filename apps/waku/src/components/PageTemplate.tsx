import { registerExecutor, Url, ViewPageQuery } from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';

export function PageTemplate() {
  registerExecutor(
    ViewPageQuery,
    { pathname: '/' },
    { page: { path: '/' as Url, title: 'Foo', locale: 'en' } },
  );
  return <Page />;
}

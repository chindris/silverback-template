import '@custom/ui/styles.css';

import {
  AnyOperationId,
  ListPagesQuery,
  Locale,
  LocationProvider,
  OperationResult,
  OperationVariables,
} from '@custom/schema';
import { Frame } from '@custom/ui/routes/Frame';
import { HomePage } from '@custom/ui/routes/HomePage';
import { NotFoundPage } from '@custom/ui/routes/NotFoundPage';
import { ContentHub } from '@custom/ui/routes/ContentHub';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';
import { createPages } from 'waku';

import { BrokenLinkHandler } from './broken-link-handler.js';
import { ExecutorsClient } from './executors-client.js';
import { ExecutorsServer } from './executors-server.js';

async function query<TOperation extends AnyOperationId>(
  operation: TOperation,
  variables: OperationVariables<TOperation>,
) {
  const url = new URL('http://localhost:8888/graphql');
  url.searchParams.set('queryId', operation);
  url.searchParams.set('variables', JSON.stringify(variables || {}));
  const { data, errors } = await (await fetch(url)).json();
  if (errors) {
    throw errors;
  }
  return data as OperationResult<TOperation>;
}

export default createPages(async ({ createPage, createLayout }) => {
  createLayout({
    render: 'static',
    path: '/',
    component: ({ children, path }) => (
      <BrokenLinkHandler>
        <LocationProvider
          currentLocation={{
            pathname: path,
            searchParams: new URLSearchParams(),
            search: '',
            hash: '',
          }}
        >
          <ExecutorsServer>
            <ExecutorsClient>
              <Frame>{children}</Frame>
            </ExecutorsClient>
          </ExecutorsServer>
        </LocationProvider>
      </BrokenLinkHandler>
    ),
  });

  Object.values(Locale).forEach((lang) => {
    createPage({
      render: 'static',
      path: `/${lang}`,
      component: () => <HomePage />,
    });

    createPage({
      render: 'static',
      path: `/${lang}/content-hub`,
      component: () => <ContentHub pageSize={6} />,
    });
  });

  createPage({
    render: 'static',
    path: '/404',
    component: () => <NotFoundPage />,
  });

  // TODO: Paginate properly to not load all nodes in Drupal
  const pagePaths = new Set<string>();
  const pages = await query(ListPagesQuery, { args: 'pageSize=0&page=1' });
  pages.ssgPages?.rows.forEach((page) => {
    page?.translations?.forEach((translation) => {
      if (translation?.path) {
        pagePaths.add(translation.path);
      }
    });
  });

  createPage({
    render: 'static',
    path: '/[...path]',
    staticPaths: [...pagePaths].map((path) => path.substring(1).split('/')),
    component: Page,
  });
});

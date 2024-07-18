import '@custom/ui/styles.css';

import {
  HomePageQuery,
  ListPagesQuery,
  Locale,
  LocationProvider,
  Url,
} from '@custom/schema';
import { ContentHub } from '@custom/ui/routes/ContentHub';
import { Frame } from '@custom/ui/routes/Frame';
import { HomePage } from '@custom/ui/routes/HomePage';
import { Inquiry } from '@custom/ui/routes/Inquiry';
import { NotFoundPage } from '@custom/ui/routes/NotFoundPage';
import { Page } from '@custom/ui/routes/Page';
import React from 'react';
import { createPages } from 'waku';

import { BrokenLinkHandler } from './broken-link-handler.js';
import { ExecutorsClient } from './executors-client.js';
import { ExecutorsServer } from './executors-server.js';
import { query } from './query.js';

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

    createPage({
      render: 'static',
      path: `/${lang}/inquiry`,
      component: () => <Inquiry />,
    });
  });

  createPage({
    render: 'static',
    path: '/404',
    component: () => <NotFoundPage />,
  });

  // Initialise a map for the homepages, since we want to exclude them from
  // creating a page for their internal path.
  const homePages = await query(HomePageQuery, {});
  const homePageTranslations = new Map<Locale, Url>();
  homePages.websiteSettings?.homePage?.translations?.forEach(
    (homePageTranslation) => {
      if (homePageTranslation?.locale) {
        homePageTranslations.set(
          homePageTranslation?.locale,
          homePageTranslation?.path,
        );
      }
    },
  );

  // TODO: Paginate properly to not load all nodes in Drupal
  const pagePaths = new Set<string>();
  const pages = await query(ListPagesQuery, { args: 'pageSize=0&page=1' });
  pages.ssgPages?.rows.forEach((page) => {
    page?.translations?.forEach((translation) => {
      // We don't want to create pages for home pages, since they already have
      // the root one created (/en, /de, etc.). And there is also a redirect
      // created from the internal path to the root path during the
      // build:redirects process.
      if (
        translation?.path &&
        translation.path !== homePageTranslations.get(translation.locale)
      ) {
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

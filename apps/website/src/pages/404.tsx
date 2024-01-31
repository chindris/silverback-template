import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import {
  NotFoundPageQuery,
  registerExecutor,
  useLocation,
  ViewPageQuery,
} from '@custom/schema';
import { Page } from '@custom/ui/routes/Page';
import { PageProps } from 'gatsby';
import React from 'react';

export const query = graphql(NotFoundPageQuery);

function isTruthy<T>(value: T | undefined | null): value is T {
  return Boolean(value);
}

export default function Index({ data }: PageProps<typeof query>) {
  const [{ pathname }] = useLocation();
  const prefix = pathname.split('/')[1];

  // Get all translations of the 404 page.
  const pages =
    data.websiteSettings?.notFoundPage?.translations?.filter(isTruthy);

  // Attempt to get the one matching the current language,
  // fall back to english, and eventually pick whatever is there.
  const page =
    pages?.filter(({ locale }) => locale === prefix).pop() ||
    pages?.filter(({ locale }) => locale === 'en').pop() ||
    pages?.pop();

  // Register the resulting page for the current path name.
  registerExecutor(
    ViewPageQuery,
    {
      pathname,
    },
    {
      page,
    },
  );
  return <Page />;
}

import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import { HomePageQuery, registerExecutor } from '@custom/schema';
import { HomePage } from '@custom/ui/routes/HomePage';
import { PageProps } from 'gatsby';
import React from 'react';

export const query = graphql(HomePageQuery);

export default function Index({ data }: PageProps<typeof query>) {
  registerExecutor(HomePageQuery, {}, data);
  return <HomePage />;
}

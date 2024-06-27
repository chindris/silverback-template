import { graphql } from '@amazeelabs/gatsby-plugin-operations';
import { NotFoundPageQuery, OperationExecutorsProvider } from '@custom/schema';
import { NotFoundPage } from '@custom/ui/routes/NotFoundPage';
import { PageProps } from 'gatsby';
import React from 'react';

export const query = graphql(NotFoundPageQuery);

export default function Index({ data }: PageProps<typeof query>) {
  return (
    <OperationExecutorsProvider
      executors={[{ executor: data, id: NotFoundPageQuery }]}
    >
      <NotFoundPage />
    </OperationExecutorsProvider>
  );
}

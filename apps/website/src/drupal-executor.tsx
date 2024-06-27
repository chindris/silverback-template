import {
  AnyOperationId,
  OperationExecutorsProvider,
  OperationVariables,
} from '@custom/schema';
import React, { PropsWithChildren } from 'react';

/**
 * Create an executor that operates against a Drupal endpoint.
 */
function drupalExecutor(endpoint: string, forward: boolean = true) {
  return async function <OperationId extends AnyOperationId>(
    id: OperationId,
    variables?: OperationVariables<OperationId>,
  ) {
    const url = new URL(endpoint);
    const isMutation = id.includes('Mutation:');
    if (isMutation) {
      const { data, errors } = await (
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            queryId: id,
            variables: variables || {},
          }),
          headers: forward
            ? {
                'SLB-Forwarded-Proto': window.location.protocol.slice(0, -1),
                'SLB-Forwarded-Host': window.location.hostname,
                'SLB-Forwarded-Port': window.location.port,
                'Content-Type': 'application/json',
              }
            : {
                'Content-Type': 'application/json',
              },
        })
      ).json();
      if (errors) {
        throw errors;
      }
      return data;
    } else {
      url.searchParams.set('queryId', id);
      url.searchParams.set('variables', JSON.stringify(variables || {}));
      const { data, errors } = await (
        await fetch(url, {
          credentials: 'include',
          headers: forward
            ? {
                'SLB-Forwarded-Proto': window.location.protocol.slice(0, -1),
                'SLB-Forwarded-Host': window.location.hostname,
                'SLB-Forwarded-Port': window.location.port,
              }
            : {},
        })
      ).json();
      if (errors) {
        throw errors;
      }
      return data;
    }
  };
}

export function DrupalExecutor({
  children,
  url,
}: PropsWithChildren<{ url: string }>) {
  return (
    <OperationExecutorsProvider
      executors={[{ executor: drupalExecutor(`${url}/graphql`, false) }]}
    >
      {children}
    </OperationExecutorsProvider>
  );
}

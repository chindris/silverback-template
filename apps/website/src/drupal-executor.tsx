import {
  AnyOperationId,
  OperationExecutorsProvider,
  OperationVariables,
} from '@custom/schema';
import React, { PropsWithChildren } from 'react';

/**
 * Create an executor that operates against a Drupal endpoint.
 */
function drupalExecutor(endpoint: string) {
  return async function <OperationId extends AnyOperationId>(
    id: OperationId,
    variables?: OperationVariables<OperationId>,
  ) {
    const url = new URL(endpoint);
    const publicUrl =
      typeof window !== 'undefined'
        ? new URL(window.location.href)
        : new URL(process.env.WAKU_PUBLIC_URL || 'http://127.0.0.1:8000');
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
          headers: publicUrl.hostname
            ? {
                'SLB-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
                'SLB-Forwarded-Host': publicUrl.hostname,
                'SLB-Forwarded-Port': publicUrl.port,
                'X-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
                'X-Forwarded-Host': publicUrl.hostname,
                'X-Forwarded-Port': publicUrl.port,
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
          headers: publicUrl.hostname
            ? {
                'SLB-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
                'SLB-Forwarded-Host': publicUrl.hostname,
                'SLB-Forwarded-Port': publicUrl.port,
                'X-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
                'X-Forwarded-Host': publicUrl.hostname,
                'X-Forwarded-Port': publicUrl.port,
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
      executors={[{ executor: drupalExecutor(`${url}/graphql`) }]}
    >
      {children}
    </OperationExecutorsProvider>
  );
}

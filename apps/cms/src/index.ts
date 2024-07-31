import type { AnyOperationId, OperationVariables } from '@custom/schema';

export function createDrupalExecutor(host: string) {
  return async function <OperationId extends AnyOperationId>(
    id: OperationId,
    variables?: OperationVariables<OperationId>,
  ) {
    const url = new URL(`${host}/graphql`);
    const isMutation = id.includes('Mutation:');
    const publicUrl =
      typeof window !== 'undefined'
        ? new URL(window.location.href)
        : new URL(process.env.WAKU_PUBLIC_URL || 'http://127.0.0.1:8000');
    const headers = {
      'SLB-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
      'SLB-Forwarded-Host': publicUrl.hostname,
      'SLB-Forwarded-Port': publicUrl.port,
      'X-Forwarded-Proto': publicUrl.protocol.slice(0, -1),
      'X-Forwarded-Host': publicUrl.hostname,
      'X-Forwarded-Port': publicUrl.port,
    };
    if (isMutation) {
      const { data, errors } = await (
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            queryId: id,
            variables: variables || {},
          }),
          headers: {
            ...headers,
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
          headers,
        })
      ).json();
      if (errors) {
        throw errors;
      }
      return data;
    }
  };
}

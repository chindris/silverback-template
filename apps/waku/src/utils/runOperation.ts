import {
  AnyOperationId,
  OperationResult,
  OperationVariables,
} from '@custom/schema';

const internal = process.env.DRUPAL_INTERNAL_URL || 'http://localhost:8888';
const external = process.env.DRUPAL_EXTERNAL_URL || 'http://localhost:8888';

const getForwardedHeaders = (url: URL) => ({
  'X-Forwarded-Proto': url.protocol === 'https:' ? 'https' : 'http',
  'X-Forwarded-Host': url.hostname,
  'X-Forwarded-Port': url.port,
  'SLB-Forwarded-Proto': url.protocol === 'https:' ? 'https' : 'http',
  'SLB-Forwarded-Host': url.hostname,
  'SLB-Forwarded-Port': url.port,
});

export async function runOperation<TOperation extends AnyOperationId>(
  id: TOperation,
  variables: OperationVariables<TOperation>,
): Promise<OperationResult<TOperation>> {
  const result = await fetch(`${internal}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getForwardedHeaders(new URL(external)),
    },
    body: JSON.stringify({
      id,
      variables,
    }),
  });
  return (await result.json()).data;
}

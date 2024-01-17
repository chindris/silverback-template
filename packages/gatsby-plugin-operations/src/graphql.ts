import { readFileSync } from 'fs';
import type { CreatePagesArgs } from 'gatsby';

export let _graphql: CreatePagesArgs['graphql'] | undefined = undefined;
let _operations: Record<string, string> | undefined = undefined;

/**
 * Initialize the library. Happens in `./gatsby-node.ts`
 */
export function initialize(
  graphql: CreatePagesArgs['graphql'],
  operations: string,
) {
  _graphql = graphql;
  _operations = JSON.parse(readFileSync(operations).toString());
}

/**
 * Execute a graphql query against gatsby.
 */
export function graphqlQuery(id: string, vars?: any): any {
  if (!_graphql) {
    throw '_graphql has not been initialized';
  }
  if (!_operations) {
    throw '_operations have not been initialized';
  }
  const operation = _operations?.[id];
  return _graphql(operation, vars);
}

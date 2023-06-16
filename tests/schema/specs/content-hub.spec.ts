import gql from 'noop-tag';
import { describe, expect, it } from 'vitest';

import { fetch } from '../lib';

describe('content hub', () => {
  it('returns limited results', async () => {
    const result = await fetch(gql`
      {
        contentHub(pagination: { limit: 2, offset: 0 }) {
          items {
            title
          }
          total
        }
      }
    `);
    expect(result.data.contentHub.total).toBeGreaterThan(2);
    expect(result.data.contentHub.items.length).toBe(2);
  });

  it('respects an offset', async () => {
    const resultA = await fetch(gql`
      {
        contentHub(pagination: { limit: 2, offset: 0 }) {
          items {
            path
          }
        }
      }
    `);
    const resultB = await fetch(gql`
      {
        contentHub(pagination: { limit: 2, offset: 1 }) {
          items {
            path
          }
        }
      }
    `);

    expect(resultA.data.contentHub.items[0].path).not.toBe(
      resultB.data.contentHub.items[0].path,
    );
    expect(resultA.data.contentHub.items[1].path).not.toBe(
      resultB.data.contentHub.items[1].path,
    );
    expect(resultA.data.contentHub.items[1].path).toBe(
      resultB.data.contentHub.items[0].path,
    );
  });

  it('accepts a query for the title', async () => {
    const result = await fetch(gql`
      {
        contentHub(query: "Arch", pagination: { limit: 3, offset: 0 }) {
          total
          items {
            path
          }
        }
      }
    `);
    expect(result.data.contentHub.items[0].path).toBe('/en/architecture');
  });
});

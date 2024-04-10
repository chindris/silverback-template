import gql from 'noop-tag';
import { describe, expect, it } from 'vitest';

import { fetch } from '../lib.js';

describe('content hub', () => {
  it('returns limited results', async () => {
    const result = await fetch(gql`
      {
        contentHub(locale: en, args: "pageSize=2") {
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

  it('respects pagination', async () => {
    const resultA = await fetch(gql`
      {
        contentHub(locale: en, args: "pageSize=1&page=2") {
          items {
            path
          }
        }
      }
    `);
    const resultB = await fetch(gql`
      {
        contentHub(locale: en, args: "pageSize=2") {
          items {
            path
          }
        }
      }
    `);

    expect(resultA.data.contentHub.items.length).toBe(1);
    expect(resultB.data.contentHub.items.length).toBe(2);
    expect(resultA.data.contentHub.items[0].path).toBe(
      resultB.data.contentHub.items[1].path,
    );
  });

  it('accepts a query for the title', async () => {
    const result = await fetch(gql`
      {
        contentHub(locale: en, args: "title=Arch&pageSize=3") {
          total
          items {
            path
          }
        }
      }
    `);
    expect(result.data.contentHub.items[0].path).toBe('/en/architecture');
  });

  it('queries results in a different language', async () => {
    const result = await fetch(gql`
      {
        contentHub(locale: de, args: "title=Arch&pageSize=3") {
          total
          items {
            path
          }
        }
      }
    `);
    expect(result.data.contentHub.items[0].path).toBe('/de/architektur');
  });

  it('only returns items in the queried language', async () => {
    const result = await fetch(gql`
      {
        contentHub(locale: de, args: "title=Gatsby&pageSize=3") {
          total
          items {
            path
          }
        }
      }
    `);
    expect(result.data.contentHub.total).toBe(0);
  });
});

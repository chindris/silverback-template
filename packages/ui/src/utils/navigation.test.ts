import { Url } from '@custom/schema';
import { describe, expect, it } from 'vitest';

import { buildNavigationTree } from './navigation';

describe('buildNavigationTree', () => {
  it('should not break on an empty array', () => {
    expect(buildNavigationTree([])).toEqual([]);
  });
  it('adds an empty list of children', () => {
    expect(
      buildNavigationTree([
        {
          id: '1',
          parent: undefined,
          target: '/en' as Url,
          title: 'English',
        },
      ]),
    ).toEqual([
      {
        id: '1',
        parent: undefined,
        target: '/en' as Url,
        title: 'English',
        children: [],
      },
    ]);
  });

  it('attaches children to their parents', () => {
    expect(
      buildNavigationTree([
        {
          id: '1',
          parent: undefined,
          target: '/A' as Url,
          title: 'A',
        },
        {
          id: '2',
          parent: '1',
          target: '/B' as Url,
          title: 'B',
        },
        {
          id: '3',
          parent: '2',
          target: '/C' as Url,
          title: 'C',
        },
        {
          id: '4',
          parent: '2',
          target: '/D' as Url,
          title: 'D',
        },
        {
          id: '5',
          parent: undefined,
          target: '/E' as Url,
          title: 'E',
        },
      ]),
    ).toEqual([
      {
        id: '1',
        parent: undefined,
        target: '/A' as Url,
        title: 'A',
        children: [
          {
            id: '2',
            parent: '1',
            target: '/B' as Url,
            title: 'B',
            children: [
              {
                id: '3',
                parent: '2',
                target: '/C' as Url,
                title: 'C',
                children: [],
              },
              {
                id: '4',
                parent: '2',
                target: '/D' as Url,
                title: 'D',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '5',
        parent: undefined,
        target: '/E' as Url,
        title: 'E',
        children: [],
      },
    ]);
  });
});

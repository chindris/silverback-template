import { Url } from '@custom/schema';
import { describe, expect, it } from 'vitest';

import { buildNavigationTree } from './navigation';

describe('buildNavigationTree', () => {
  it('should not break on an empty array', () => {
    expect(buildNavigationTree([], 'en')).toEqual([]);
  });
  it('adds an empty list of children', () => {
    expect(
      buildNavigationTree(
        [
          {
            id: '1',
            parent: undefined,
            locale: 'en',
            target: '/en' as Url,
            title: 'English',
          },
        ],
        'en',
      ),
    ).toEqual([
      {
        id: '1',
        parent: undefined,
        locale: 'en',
        target: '/en' as Url,
        title: 'English',
        children: [],
      },
    ]);
  });
  it('filters for the current locale', () => {
    expect(
      buildNavigationTree(
        [
          {
            id: '1',
            parent: undefined,
            locale: 'en',
            target: '/en' as Url,
            title: 'English',
          },
          {
            id: '2',
            parent: undefined,
            locale: 'de',
            target: '/de' as Url,
            title: 'Deutsch',
          },
        ],
        'en',
      ),
    ).toEqual([
      {
        id: '1',
        parent: undefined,
        locale: 'en',
        target: '/en' as Url,
        title: 'English',
        children: [],
      },
    ]);
  });

  it('attaches children to their parents', () => {
    expect(
      buildNavigationTree(
        [
          {
            id: '1',
            parent: undefined,
            locale: 'en',
            target: '/A' as Url,
            title: 'A',
          },
          {
            id: '2',
            parent: '1',
            locale: 'en',
            target: '/B' as Url,
            title: 'B',
          },
          {
            id: '3',
            parent: '2',
            locale: 'en',
            target: '/C' as Url,
            title: 'C',
          },
          {
            id: '4',
            parent: '2',
            locale: 'en',
            target: '/D' as Url,
            title: 'D',
          },
          {
            id: '5',
            parent: undefined,
            locale: 'en',
            target: '/E' as Url,
            title: 'E',
          },
        ],
        'en',
      ),
    ).toEqual([
      {
        id: '1',
        parent: undefined,
        locale: 'en',
        target: '/A' as Url,
        title: 'A',
        children: [
          {
            id: '2',
            parent: '1',
            locale: 'en',
            target: '/B' as Url,
            title: 'B',
            children: [
              {
                id: '3',
                parent: '2',
                locale: 'en',
                target: '/C' as Url,
                title: 'C',
                children: [],
              },
              {
                id: '4',
                parent: '2',
                locale: 'en',
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
        locale: 'en',
        target: '/E' as Url,
        title: 'E',
        children: [],
      },
    ]);
  });
});

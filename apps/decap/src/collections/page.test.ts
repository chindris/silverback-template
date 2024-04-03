import { expect, test, vi } from 'vitest';

import { getPages } from '..';

vi.mock('../helpers/path', () => ({
  path: `${new URL(import.meta.url).pathname
    .split('/')
    .slice(0, -1)
    .join('/')}/../..`,
}));

test('getPages', () => {
  expect(() => getPages()).not.toThrow();
});

import { expect, test, vi } from 'vitest';

import { getTranslatables } from './translatables';

vi.mock('../helpers/path', () => ({
  path: `${new URL(import.meta.url).pathname
    .split('/')
    .slice(0, -1)
    .join('/')}/../..`,
}));

test('getTranslatables', () => {
  expect(() => getTranslatables()).not.toThrow();
});

import { dirname, resolve } from 'node:path';
import { afterEach } from 'node:test';

import { expect, test, vi } from 'vitest';

import { getTranslatables } from './translatables';

afterEach(vi.resetAllMocks);

test('getTranslatables', () => {
  const dir = resolve(dirname(new URL(import.meta.url).pathname), '../../data');
  expect(getTranslatables(dir)).not.toThrow();
});

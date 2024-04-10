import { dirname, resolve } from 'path';
import { expect, test } from 'vitest';

import { getPages } from '..';

test('getPages', () => {
  const dir = resolve(
    dirname(new URL(import.meta.url).pathname),
    '../../data/page',
  );
  expect(() => getPages(dir)).not.toThrow();
});

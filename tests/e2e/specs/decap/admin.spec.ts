import { expect, test } from '@chromatic-com/playwright';

import { websiteUrl } from '../../helpers/url';

test('decap admin is available', async ({ page }) => {
  const response = await page.goto(websiteUrl('/admin'));
  expect(response?.status()).toBe(200);
});

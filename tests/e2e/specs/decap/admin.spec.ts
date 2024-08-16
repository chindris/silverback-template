import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test('decap admin is available', async ({ page }) => {
  const response = await page.goto(websiteUrl('/admin'));
  expect(response?.status()).toBe(200);
});

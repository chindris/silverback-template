import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test.describe('drupal redirects', () => {
  test('are detected', async ({ page }) => {
    const response = await page.goto(websiteUrl('/node/1'));
    await expect(response?.status()).toBe(200);
    await expect(page.url).not.toBe(websiteUrl('/node/1'));
  });
});

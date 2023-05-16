import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('drupal redirects', () => {
  test('are detected', async ({ page }) => {
    await page.goto(websiteUrl('/node/1'));
    const content = await page.getByRole('main');
    await expect(
      content.getByText('The requested page is currently in the bathroom.'),
    ).not.toBeVisible();
  });
});

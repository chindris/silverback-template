import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test.describe('drupal pages', () => {
  test('example drupal page is rendered', async ({ page }) => {
    await page.goto(websiteUrl('/en/privacy'));
    const content = page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Privacy' }),
    ).toBeVisible();
  });
  test('example drupal page is translated', async ({ page }) => {
    await page.goto(websiteUrl('/en/privacy'));
    await page.getByRole('link', { name: 'de' }).click();
    await expect(
      page.getByRole('heading', { name: 'Privatsphäre' }),
    ).toBeVisible();
  });
});

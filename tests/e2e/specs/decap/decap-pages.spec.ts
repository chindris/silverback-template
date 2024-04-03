import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test.describe('decap pages', () => {
  test('example decap page is rendered', async ({ page }) => {
    await page.goto(websiteUrl('/en/decap-example'));
    const content = page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Decap Example' }),
    ).toBeVisible();
    await expect(
      content.getByText('This page was created with Decap CMS'),
    ).toBeVisible();
    await page.getByRole('link', { name: 'de' }).click();
    await expect(
      content.getByRole('heading', { name: 'Decap Beispiel' }),
    ).toBeVisible();
  });
});

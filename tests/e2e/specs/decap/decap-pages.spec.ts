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

    // Open the language switcher and click on the German language
    await page.getByRole('button', { name: 'English' }).click();
    // Think 'getByRole' does not work as item gets removed from the DOM.
    await page.locator("//a[contains(text(),'Deutsch')]").click();

    await expect(
      content.getByRole('heading', { name: 'Decap Beispiel' }),
    ).toBeVisible();
  });
});

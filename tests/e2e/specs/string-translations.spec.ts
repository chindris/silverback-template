import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('the string translations', () => {
  test('copyright exists in english', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    await expect(
      page.locator('footer p.text-center')
    ).toHaveText('© 2020 Company name, Inc. All rights reserved.')
  });

  // @todoo: We need this translation in the test database first.
  /*test('copyright exists in german', async ({ page }) => {
    await page.goto(websiteUrl('/de'));
    await expect(
      page.locator('footer p.text-center')
    ).toHaveText('© 2020 Company name, Inc. Alle Rechte vorbehalten.')
  });*/
});

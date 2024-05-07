import { expect, test } from '@playwright/test';

import { cmsUrl } from '../../helpers/url';

test.describe('content-editing', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('moderation controls are placed in the sidebar', async ({ page }) => {
    await page.goto(cmsUrl('/drupal'));
    await page.locator('li.tabs__tab a:text("Edit")').click();
    await expect(
      page.locator('[aria-label="Editor settings"]').getByText('Change to'),
    ).toBeVisible();
  });

  test('"More settings" fieldset is removed', async ({ page }) => {
    await page.goto(cmsUrl('/drupal'));
    await page.locator('li.tabs__tab a:text("Edit")').click();
    // Why we expect it to be removed:
    // - It's too long to scroll to the bottom of long pages
    // - If we have any valuable controls in the "More settings" fieldset,
    //   we should move them to the sidebar, where they are much easier to
    //   access
    await expect(page.locator(':text-is("More settings")')).toHaveCount(0);
  });
});

import { expect, test } from '@playwright/test';

import { cmsUrl } from '../../helpers/url';

test.describe('content-editing', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('moderation controls are placed in the sidebar', async ({ page }) => {
    await page.goto(cmsUrl('/node/add/page'));
    await expect(
      page.locator('[aria-label="Editor settings"]').getByText('Save as'),
    ).toBeVisible();
  });

  test('"More settings" fieldset is removed', async ({ page }) => {
    // Why we expect it to be removed:
    // - It's too long to scroll to the bottom of long pages
    // - If we have any valuable controls in the "More settings" fieldset,
    //   we should move them to the sidebar, where they are much easier to
    //   access
    await page.goto(cmsUrl('/node/add/page'));
    await expect(page.locator(':text-is("More settings")')).toHaveCount(0);
  });
});

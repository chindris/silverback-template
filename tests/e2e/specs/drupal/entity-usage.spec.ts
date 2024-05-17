import { expect, test } from '@playwright/test';

import { cmsUrl } from '../../helpers/url';

test.describe('entity-usage', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('media usage works with inline doc links', async ({ page }) => {
    await page.goto(cmsUrl('/admin/content/media'));
    page.locator('div.view-content').getByText('Example DOCX document').click();
    page.locator('a.tabs__link').getByText('Usage').click();
    await expect(
      page.locator('table').getByText('Page with links'),
    ).toBeVisible();
  });
});

import { expect, test } from '@chromatic-com/playwright';

import { cmsUrl } from '../../helpers/url';

test.describe('entity-usage', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('media usage works with inline doc links', async ({ page }) => {
    await page.goto(cmsUrl('/admin/content/media'));
    await page
      .locator('div.view-content')
      .getByText('Example DOCX document')
      .click();
    await page.locator('a.tabs__link').getByText('Usage').click();
    await expect(
      page.locator('table').getByText('Page with links'),
    ).toBeVisible();
  });
});

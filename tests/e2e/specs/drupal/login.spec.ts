import { expect, test } from '@playwright/test';

import { cmsUrl } from '../../helpers/url';

test.describe('authentication', () => {
  test.use({ storageState: '.auth/admin.json' });
  test('login form', async ({ page }) => {
    await page.goto(cmsUrl('/user'));
    await expect(
      page.getByRole('heading', { name: 'admin', exact: true }),
    ).toBeVisible();
  });
});

import { expect, test as setup } from '@playwright/test';

import { cmsUrl } from '../../helpers/url';

setup('setup', async ({ page }) => {
  await page.goto(cmsUrl('/user/login'));
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(
    page.getByRole('heading', { name: 'admin', exact: true }),
  ).toHaveCount(1);
  await page.context().storageState({ path: '.auth/admin.json' });
});

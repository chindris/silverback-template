import { expect, test } from '@playwright/test';

test('decap', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(
    page.getByRole('heading', { name: 'Collections' }),
  ).toBeVisible();
});

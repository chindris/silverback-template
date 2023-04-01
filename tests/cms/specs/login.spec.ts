import { test } from '@playwright/test';

test('admin login', async ({ page }) => {
  await page.goto('http://localhost:8888/');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('heading', { name: 'admin' });
});

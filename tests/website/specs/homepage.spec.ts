import { test } from '@playwright/test';

test('has a logo', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByRole('link', { name: 'Your Company' });
});

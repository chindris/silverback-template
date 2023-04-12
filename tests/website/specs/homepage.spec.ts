import { test, expect } from '@playwright/test';

test('has a logo', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  const visible = await page
    .getByRole('link', { name: 'Company name' })
    .isVisible();
  expect(visible).toBe(true);
});

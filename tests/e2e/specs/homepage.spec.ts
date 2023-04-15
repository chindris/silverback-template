import { test, expect } from '@playwright/test';
import { websiteUrl } from '../helpers/url';

test('has a logo', async ({ page }) => {
  await page.goto(websiteUrl('/'));
  expect(await page.getByRole('link', { name: 'Company name' })).toHaveCount(1);
});

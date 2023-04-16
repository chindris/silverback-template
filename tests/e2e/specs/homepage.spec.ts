import { test, expect } from '@playwright/test';
import { websiteUrl } from '../helpers/url';

test.describe('the homepage', () => {
  test('exists in english', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architecture')).toBeVisible();
  });

  test('exists in german', async ({ page }) => {
    await page.goto(websiteUrl('/de'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architektur')).toBeVisible();
  });

  test('redirects to root path on direct access', async ({ page }) => {
    await page.goto(websiteUrl('/en/architecture'));
    await expect(page.url()).toBe(websiteUrl('/en/'));
  });

  test('it redirects to english by default', async ({ page }) => {
    await page.goto(websiteUrl('/'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architecture')).toBeVisible();
  });

  test.describe('if german is the preferred language', () => {
    test.use({ locale: 'de-DE' });
    test('redirects to german ', async ({ page }) => {
      await page.goto(websiteUrl('/'));
      const content = await page.getByRole('main');
      await expect(content.getByText('Architektur')).toBeVisible();
    });
  });
});

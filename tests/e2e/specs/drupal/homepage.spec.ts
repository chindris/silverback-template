import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';
import { QuickActions, SiteLanguage } from '../../helpers/quick-actions';

test.describe('the homepage', () => {
  test('exists in english', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    const content = await page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Architecture' }),
    ).toBeVisible();
  });

  test('exists in german', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en'));
    const content = await page.getByRole('main');
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    await expect(
      content.getByRole('heading', { name: 'Architektur' }),
    ).toBeVisible();
  });

  test('redirects to root path on direct access', async ({ page }) => {
    await page.goto(websiteUrl('/en/architecture'));
    await expect(page.url()).toBe(websiteUrl('/en'));
  });

  test('it redirects to english by default', async ({ page }) => {
    await page.goto(websiteUrl('/'));
    const content = await page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Architecture' }),
    ).toBeVisible();
  });

  test.describe('if german is the preferred language', () => {
    test.use({ locale: 'de-DE' });
    test('redirects to german ', async ({ page }) => {
      await page.goto(websiteUrl('/'));
      const content = await page.getByRole('main');
      await expect(
        content.getByText('Architektur', { exact: true }),
      ).toBeVisible();
    });
  });

  test('it displays an image', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    const image = page.getByAltText('Decoupled architecture sketch');
    await expect(image).toBeVisible();
  });
});

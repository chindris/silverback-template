import { expect, test } from '@playwright/test';

import { QuickActions, SiteLanguage } from '../../helpers/quick-actions';
import { websiteUrl } from '../../helpers/url';

test.describe('content hub', () => {
  test.beforeEach(async ({ page }) => {
    page.emulateMedia({ reducedMotion: 'reduce' });
  });
  test('lists pages in alphabetic order', async ({ page }) => {
    await page.goto(websiteUrl('/en/content-hub'));
    const content = await page.getByRole('main');
    const heading = page.getByRole('heading', {
      name: 'Architecture',
      level: 5,
    });
    await expect(heading).toBeVisible();
    await expect(content.getByText('PHP')).not.toBeVisible();
  });

  test('allows to switch pages', async ({ page }) => {
    await page.goto(websiteUrl('/en/content-hub'));
    const content = await page.getByRole('main');
    const heading = page.getByRole('heading', {
      name: 'Architecture',
      level: 5,
    });
    await expect(heading).toBeVisible();
    await expect(content.getByText('Gatsby')).not.toBeVisible();
    await content.getByText('Next').click();
    await expect(heading).not.toBeVisible();
    await expect(content.getByText('Gatsby')).toBeVisible();
  });

  test('allows to search for items', async ({ page }) => {
    await page.goto(websiteUrl('/en/content-hub'));
    const content = await page.getByRole('main');
    await content.getByPlaceholder('Keyword').fill('technologies');
    await content.getByRole('button', { name: 'Search' }).click();
    const heading = page.getByRole('heading', {
      name: 'Architecture',
      level: 5,
    });
    await expect(heading).not.toBeVisible();
    await expect(content.getByText('Technologies')).toBeVisible();
  });

  test('returns language specific results', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en/content-hub'));
    // Change language to German.
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    const content = await page.getByRole('main');
    const deHeading = page.getByRole('heading', {
      name: 'Architektur',
      level: 5,
    });
    const enHeading = page.getByRole('heading', {
      name: 'Architecture',
      level: 5,
    });
    await expect(deHeading).toBeVisible();
    await expect(enHeading).not.toBeVisible();
    await expect(content.getByText('Gatsby')).not.toBeVisible();
  });
});

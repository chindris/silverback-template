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
    await expect(content.getByText('Architecture')).toBeVisible();
    await expect(content.getByText('PHP')).not.toBeVisible();
  });

  test('allows to switch pages', async ({ page }) => {
    await page.goto(websiteUrl('/en/content-hub'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architecture')).toBeVisible();
    await expect(content.getByText('Gatsby')).not.toBeVisible();
    await content.getByText('Next').click();
    await expect(content.getByText('Architecture')).not.toBeVisible();
    await expect(content.getByText('Gatsby')).toBeVisible();
  });

  test('allows to search for items', async ({ page }) => {
    await page.goto(websiteUrl('/en/content-hub'));
    const content = await page.getByRole('main');
    await content.getByPlaceholder('Keyword').fill('technologies');
    await content.getByRole('button', { name: 'Search' }).click();
    await expect(content.getByText('Architecture')).not.toBeVisible();
    await expect(content.getByText('Technologies')).toBeVisible();
  });

  test('returns language specific results', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en/content-hub'));
    // Change language to German.
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    const content = await page.getByRole('main');
    await expect(content.getByText('Architektur')).toBeVisible();
    await expect(content.getByText('Architecture')).not.toBeVisible();
    await expect(content.getByText('Gatsby')).not.toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';
import { QuickActions, SiteLanguage } from '../../helpers/quick-actions';

test.describe('decap pages', () => {
  test('example decap page is rendered', async ({ page }) => {
    const quickActions = new QuickActions(page);

    await page.goto(websiteUrl('/en/decap-example'));
    const content = page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Decap Example' }),
    ).toBeVisible();
    await expect(
      content.getByText('This page was created with Decap CMS'),
    ).toBeVisible();

    // Change language to German.
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);

    await expect(
      content.getByRole('heading', { name: 'Decap Beispiel' }),
    ).toBeVisible();
  });
});

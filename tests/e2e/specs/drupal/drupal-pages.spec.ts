import { expect, test } from '@chromatic-com/playwright';

import { QuickActions, SiteLanguage } from '../../helpers/quick-actions';
import { websiteUrl } from '../../helpers/url';

test.describe('drupal pages', () => {
  test('example drupal page is rendered', async ({ page }) => {
    await page.goto(websiteUrl('/en/privacy'));
    const content = page.getByRole('main');
    await expect(
      content.getByRole('heading', { name: 'Privacy' }),
    ).toBeVisible();
  });
  test('example drupal page is translated', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en/privacy'));
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    await expect(
      page.getByRole('heading', { name: 'Privatsphäre' }),
    ).toBeVisible();
  });
});

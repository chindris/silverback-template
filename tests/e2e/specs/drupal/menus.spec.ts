import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';
import { QuickActions, SiteLanguage } from '../../helpers/quick-actions';

test.describe('menus', () => {
  test('main navigation', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en'));
    const mainNav = page.getByRole('banner').getByRole('navigation');
    await expect(mainNav.getByText('Architecture')).toBeVisible();
    await expect(mainNav.getByText('Architektur')).not.toBeVisible();
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    await expect(mainNav.getByText('Architecture')).not.toBeVisible();
    await expect(mainNav.getByText('Gatsby')).not.toBeVisible();
    await expect(mainNav.getByText('Architektur')).toBeVisible();
  });

  test('footer navigation', async ({ page }) => {
    const quickActions = new QuickActions(page);
    await page.goto(websiteUrl('/en'));
    const footerNav = page.getByRole('contentinfo').getByRole('navigation');
    await expect(footerNav.getByText('Privacy')).toBeVisible();
    await expect(footerNav.getByText('Privatsphäre')).not.toBeVisible();
    await quickActions.changeLanguageTo(SiteLanguage.Deutsch);
    await expect(footerNav.getByText('Privacy')).not.toBeVisible();
    await expect(footerNav.getByText('Privatsphäre')).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('menus', () => {
  test('main navigation', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    const mainNav = page.getByRole('banner').getByRole('navigation');
    await expect(mainNav.getByText('Architecture')).toBeVisible();
    await expect(mainNav.getByText('Architektur')).not.toBeVisible();
    await page.getByRole('link', { name: 'de' }).click();
    await expect(mainNav.getByText('Architecture')).not.toBeVisible();
    await expect(mainNav.getByText('Gatsby')).not.toBeVisible();
    await expect(mainNav.getByText('Architektur')).toBeVisible();
  });

  test('footer navigation', async ({ page }) => {
    await page.goto(websiteUrl('/en'));
    const mainNav = page.getByRole('contentinfo').getByRole('navigation');
    await expect(mainNav.getByText('Privacy')).toBeVisible();
    await expect(mainNav.getByText('Privatsphäre')).not.toBeVisible();
    await page.getByRole('link', { name: 'de' }).click();
    await expect(mainNav.getByText('Privacy')).not.toBeVisible();
    await expect(mainNav.getByText('Privatsphäre')).toBeVisible();
  });
});

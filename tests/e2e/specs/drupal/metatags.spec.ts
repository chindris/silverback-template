import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test('Metatags on Basic page', async ({ page }) => {
  const pageUrl = websiteUrl('/en/page-complete');
  await page.goto(pageUrl);
  await expect(page.locator('head meta[name="title"]')).toHaveAttribute(
    'content',
    'Page: complete | Silverback Drupal Template',
  );
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    'content',
    'Paragraph',
  );
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    'href',
    pageUrl,
  );
});

test('HTML lang attribute', async ({ page }) => {
  await page.goto(websiteUrl('/en'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto(websiteUrl('/de'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');

  // This does not work until https://amazeelabs.atlassian.net/browse/SLB-437
  // gets fixed, as the '/en/imprint' shows the German page (which is the
  // original one).
  //await page.goto(websiteUrl('/en/imprint'));
  //await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  //await page.goto(websiteUrl('/de/impressum'));
  //await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

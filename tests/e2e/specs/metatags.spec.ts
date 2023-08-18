import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

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

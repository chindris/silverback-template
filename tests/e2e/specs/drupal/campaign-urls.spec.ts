import { expect, test } from '@chromatic-com/playwright';

import { websiteUrl } from '../../helpers/url';

test.use({ disableAutoSnapshot: true });

test.describe('campaign url redirects', () => {
  test('simple redirects', async ({ page }) => {
    await page.goto(websiteUrl('/php_redirect'));
    await expect(page).toHaveURL(websiteUrl('/en/php'));

    await page.goto(websiteUrl('/prvtsphaere'));
    await expect(page).toHaveURL(websiteUrl('/de/privatsphaere'));
  });

  test('splat redirects', async ({ page }) => {
    await page.goto(websiteUrl('/old_tree/oak'));
    await expect(page).toHaveURL(websiteUrl('/en/tree/oak'));

    await page.goto(websiteUrl('/old_tree/maple'));
    await expect(page).toHaveURL(websiteUrl('/en/tree/maple'));

    await page.goto(websiteUrl('/old_tree/cherry'));
    await expect(page).toHaveURL(websiteUrl('/en/tree/cherry'));
  });
});

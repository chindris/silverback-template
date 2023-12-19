import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('decap pages', () => {
  test('example decap page is rendered', async ({ page }) => {
    await page.goto(websiteUrl('/decap-example'));
    const content = page.getByRole('main');
    await expect(content.getByRole('heading', { name: 'Decap' })).toBeVisible();
    await expect(
      content.getByText('This page was created with Decap CMS'),
    ).toBeVisible();
  });
});

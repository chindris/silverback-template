import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test.describe('content hub', () => {
  test('lists pages in alphabetic order', async ({ page }) => {
    await page.goto(websiteUrl('/content-hub'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architecture')).toBeVisible();
    await expect(content.getByText('PHP')).not.toBeVisible();
  });

  test('allows to switch pages', async ({ page }) => {
    await page.goto(websiteUrl('/content-hub'));
    const content = await page.getByRole('main');
    await expect(content.getByText('Architecture')).toBeVisible();
    await expect(content.getByText('PHP')).not.toBeVisible();
    content.getByText('Next').click();
    await expect(content.getByText('Architecture')).not.toBeVisible();
    await expect(content.getByText('PHP')).toBeVisible();
  });

  test('allows to search for items', async ({ page }) => {
    await page.goto(websiteUrl('/content-hub'));
    const content = await page.getByRole('main');
    content.getByPlaceholder('Keyword').fill('technologies');
    content.getByRole('button', { name: 'Search' }).click();
    await expect(content.getByText('Architecture')).not.toBeVisible();
    await expect(content.getByText('Technologies')).toBeVisible();
  });
});

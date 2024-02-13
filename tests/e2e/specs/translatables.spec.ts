import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test('translatable strings', async ({ page }) => {
  await page.goto(websiteUrl('/en'));
  const footer = page.getByRole('contentinfo');
  expect(
    footer.getByText('© 2024 Random Company. All rights reserved.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'de' }).click();
  expect(
    footer.getByText('© 2024 Random Company. Alle Rechte vorbehalten.'),
  ).toBeVisible();
});

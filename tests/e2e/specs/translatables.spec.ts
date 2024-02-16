import { expect, test } from '@playwright/test';

import { websiteUrl } from '../helpers/url';

test('translatable strings', async ({ page }) => {
  await page.goto(websiteUrl('/en'));
  const footer = page.getByRole('contentinfo');
  await expect(
    footer.getByText('© 2024 Random Company. All rights reserved.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'de' }).click();
  // Drupal provides the "Drupal Company" translation for the "Company Name" string.
  // Decap provides the "Random Company" translation for the "Company Name" string,
  // but Drupal translations have higher precedence.
  await expect(
    footer.getByText('© 2024 Drupal Company. Alle Rechte vorbehalten.'),
  ).toBeVisible();
});

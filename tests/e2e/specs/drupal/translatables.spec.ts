import { expect, test } from '@chromatic-com/playwright';

import { websiteUrl } from '../../helpers/url';

test('translatable strings', async ({ page }) => {
  await page.goto(websiteUrl('/de'));
  const footer = page.getByRole('contentinfo');
  // Drupal provides the "Drupal Company" translation for the "Company Name" string.
  // Not for "All rights reserved."
  await expect(footer.getByText(/Drupal Company/)).toBeVisible();
});

import { expect, test } from '@playwright/test';

import { websiteUrl } from '../../helpers/url';

test('translatable strings', async ({ page }) => {
  await page.goto(websiteUrl('/de'));
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByText(/Alle Rechte vorbehalten/)).toBeVisible();
});

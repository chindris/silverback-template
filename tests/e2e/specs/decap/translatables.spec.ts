import { expect, test } from '@chromatic-com/playwright';

import { websiteUrl } from '../../helpers/url';

test('decap translatable strings', async ({ page }) => {
  await page.goto(websiteUrl('/de'));
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByText(/Alle Rechte vorbehalten/)).toBeVisible();
});
